// src/consultation/consultation.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// NEW IMPORTS FOR AUDIT
import { AuditService } from '../common/audit/audit.service';
import { Consultation, ConsultationStatus } from './consultation.entity';
import { Prescription } from './prescription.entity';
import { ConsultationIdDto } from './dto/consultation-id.dto';
import { PrescriptionDto } from './dto/prescription.dto';

@Injectable()
export class ConsultationService {
  constructor(
    // Inject both required repositories
    @InjectRepository(Consultation)
    private consultationRepository: Repository<Consultation>,
    @InjectRepository(Prescription)
    private prescriptionRepository: Repository<Prescription>,
    // FIX 1: Inject the AuditService
    private auditService: AuditService,
  ) {}

  // --- Helper Method to find Consultation by ID (Updated to include booking relation) ---
  private async findConsultation(bookingId: string): Promise<Consultation> {
    // Must use findOne to load relations if we need booking details for the audit log
    const consultation = await this.consultationRepository.findOne({
      where: { booking_id: bookingId },
      relations: ['booking'], // Assuming 'booking' relation is defined in Consultation entity
    });
    if (!consultation) {
      throw new NotFoundException('Consultation not found for this booking.');
    }
    return consultation;
  }

  // 1. API: Start Consultation (Doctor Action)
  async startConsultation(
    doctorId: string,
    dto: ConsultationIdDto,
  ): Promise<Consultation> {
    let consultation = await this.consultationRepository.findOneBy({
      booking_id: dto.bookingId,
    });

    if (consultation && consultation.status === ConsultationStatus.COMPLETED) {
      throw new ForbiddenException('Consultation is already completed.');
    }

    if (!consultation) {
      consultation = this.consultationRepository.create({
        booking_id: dto.bookingId,
        status: ConsultationStatus.IN_PROGRESS,
        start_time: new Date(),
      });
    } else {
      consultation.status = ConsultationStatus.IN_PROGRESS;
      consultation.start_time = consultation.start_time || new Date();
    }

    return this.consultationRepository.save(consultation);
  }

  // 2. API: Submit Prescription and End Consultation (Doctor Action)
  async submitPrescription(
    doctorId: string,
    bookingId: string,
    dto: PrescriptionDto,
  ): Promise<Prescription> {
    // FIX 2: Ensure the Consultation entity is loaded with its Booking relation for the audit log
    const consultation = await this.findConsultation(bookingId);

    if (consultation.status !== ConsultationStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Consultation must be in progress to submit a prescription.',
      );
    }

    // 1. Create the Prescription Record
    const prescription = this.prescriptionRepository.create({
      consultation_id: consultation.id,
      medication_details: dto.medicationDetails,
      is_signed_off: true,
    });

    const savedPrescription =
      await this.prescriptionRepository.save(prescription);

    // 2. Update Consultation Status to COMPLETE
    consultation.status = ConsultationStatus.COMPLETED;
    consultation.end_time = new Date();
    await this.consultationRepository.save(consultation);

    // 3. Trigger Audit Trail (Conceptual Async Job - FIX 3)
    // This must be inside the function scope to access the variables
    // We use the patientId from the linked booking record
    await this.auditService.recordEvent({
      userId: doctorId,
      eventType: 'PRESCRIPTION_FILED',
      details: {
        bookingId: bookingId,
        consultationId: consultation.id,
        prescriptionId: savedPrescription.consultation_id,
        // Note: Accessing patientId requires loading the booking relation in findConsultation
        patientId: consultation.booking.patient_id,
      },
    });

    return savedPrescription;
  }
}
