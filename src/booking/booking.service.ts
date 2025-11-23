// src/booking/booking.service.ts

import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorProfile } from './doctor-profile.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UserRole } from '../common/enums/user-role.enum';
import { AvailabilitySlot, SlotStatus } from './availability-slot.entity';
import { CreateSlotDto } from './dto/create-slot.dto';
import { Booking, BookingStatus } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class BookingService {
  constructor(
    // Inject both required repositories
    @InjectRepository(DoctorProfile)
    private doctorProfileRepository: Repository<DoctorProfile>,
    @InjectRepository(AvailabilitySlot)
    private slotRepository: Repository<AvailabilitySlot>,
    // Inject Redis Cache Manager
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // Method to create or update a doctor profile (Profile Setup)
  async createProfile(
    userId: string,
    userRole: UserRole,
    dto: CreateDoctorDto,
  ): Promise<DoctorProfile> {
    if (userRole !== UserRole.DOCTOR) {
      throw new ForbiddenException(
        'Only users with the DOCTOR role can create a profile.',
      );
    }

    let profile = await this.doctorProfileRepository.findOneBy({
      user_id: userId,
    });

    if (profile) {
      profile.specialty = dto.specialty;
      profile.fees = dto.fees;
    } else {
      profile = this.doctorProfileRepository.create({
        user_id: userId,
        specialty: dto.specialty,
        fees: dto.fees,
      });
    }

    return this.doctorProfileRepository.save(profile);
  }

  // Method to create multiple availability slots (Doctor Availability)
  async createSlots(
    doctorUserId: string,
    dto: CreateSlotDto,
  ): Promise<AvailabilitySlot[]> {
    let start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    const slots: AvailabilitySlot[] = [];
    const CONSULTATION_DURATION_MS = 30 * 60 * 1000;

    const profile = await this.doctorProfileRepository.findOneBy({
      user_id: doctorUserId,
    });
    if (!profile) {
      throw new NotFoundException(
        'Doctor profile not found. Please create profile first.',
      );
    }

    while (start.getTime() < end.getTime()) {
      const slotEnd = new Date(start.getTime() + CONSULTATION_DURATION_MS);

      if (slotEnd.getTime() > end.getTime()) {
        break;
      }

      const slot = this.slotRepository.create({
        doctor_id: doctorUserId,
        start_time: start,
        end_time: slotEnd,
        status: SlotStatus.AVAILABLE,
      });
      slots.push(slot);

      start = slotEnd;
    }

    if (slots.length === 0) {
      throw new BadRequestException(
        'No valid slots could be created in the given time range.',
      );
    }

    return this.slotRepository.save(slots);
  }

  // METHOD: Find slots using Cache-Aside Pattern
  async findAvailableSlots(
    specialty: string,
    date: string,
  ): Promise<AvailabilitySlot[]> {
    const cacheKey = `slots:${specialty}:${date}`;

    const cachedSlots =
      await this.cacheManager.get<AvailabilitySlot[]>(cacheKey);
    if (cachedSlots) {
      console.log('CACHE HIT!');
      return cachedSlots;
    }

    const dateStart = new Date(date);
    const dateEnd = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000);

    const availableSlots = await this.slotRepository
      .createQueryBuilder('slot')
      .leftJoinAndSelect('slot.doctorProfile', 'profile')
      .where('profile.specialty = :specialty', { specialty })
      .andWhere('slot.status = :status', { status: SlotStatus.AVAILABLE })
      .andWhere('slot.start_time >= :dateStart', { dateStart })
      .andWhere('slot.end_time < :dateEnd', { dateEnd })
      .select(['slot.id', 'slot.start_time', 'slot.end_time', 'slot.doctor_id'])
      .getMany();

    await this.cacheManager.set(cacheKey, availableSlots, 300 * 1000);

    return availableSlots;
  }

  // NEW METHOD: Transactional Booking API (Concurrency Control)
  async createBooking(
    patientId: string,
    dto: CreateBookingDto,
  ): Promise<Booking> {
    const { slotId } = dto;

    // 1. Use a database transaction to ensure atomicity and concurrency control
    return this.slotRepository.manager.transaction(async (entityManager) => {
      // --- CONCURRENCY CONTROL: Lock the slot row (Pessimistic Write Lock) ---
      const slot = await entityManager
        .createQueryBuilder(AvailabilitySlot, 'slot')
        .setLock('pessimistic_write')
        .where('slot.id = :slotId', { slotId })
        .getOne();

      if (!slot) {
        throw new NotFoundException('Slot not found.');
      }

      // 2. Check Availability
      if (slot.status !== SlotStatus.AVAILABLE) {
        throw new BadRequestException('Slot is already booked or unavailable.');
      }

      // 3. Update Slot Status (CRITICAL WRITE)
      slot.status = SlotStatus.BOOKED;
      await entityManager.save(slot);

      // 4. Create the Booking Record
      const booking = entityManager.create(Booking, {
        patient_id: patientId,
        slot_id: slotId,
        status: BookingStatus.CONFIRMED,
      });

      const savedBooking = await entityManager.save(booking);

      // 5. Cleanup: Invalidate the cached search results for this date (Crucial for data freshness)
      // Fetch the doctor profile to get the specialty needed for the key
      const doctorProfile = await entityManager.findOneBy(DoctorProfile, {
        user_id: slot.doctor_id,
      });

      if (doctorProfile) {
        // Calculate the exact cache key that needs deletion (e.g., slots:Ayurveda:2026-03-01)
        const slotDate = slot.start_time.toISOString().split('T')[0];
        const cacheKey = `slots:${doctorProfile.specialty}:${slotDate}`;

        // Surgically delete the specific cache key using the exposed 'del' method
        await this.cacheManager.del(cacheKey);
        console.log(`CACHE INVALIDATED for key: ${cacheKey}`);
      }

      return savedBooking;
    });
  }
}
