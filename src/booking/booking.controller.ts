// src/booking/booking.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  Get,
  Query,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { BookingService } from './booking.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { CreateSlotDto } from './dto/create-slot.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { AuthRequest } from '../auth/interfaces/auth-user.interface';
import { Public } from '../common/decorators/public.decorator';
import { CreateBookingDto } from './dto/create-booking.dto';

// Note: Guards are applied globally, but we will selectively bypass them if needed.
// For now, let's keep the Guards here since the majority of actions are protected.
@Controller('booking')
@UseGuards(JwtAuthGuard, RolesGuard) // Global guards for protected actions
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // 1. ENDPOINT: Doctor Profile Creation (Protected: DOCTOR Role)
  @Post('doctor/profile')
  @Roles(UserRole.DOCTOR)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async createDoctorProfile(
    @Req() req: AuthRequest,
    @Body() dto: CreateDoctorDto,
  ) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    return this.bookingService.createProfile(userId, userRole, dto);
  }

  // 2. ENDPOINT: Doctor Availability Slot Creation (Protected: DOCTOR Role)
  @Post('doctor/availability')
  @Roles(UserRole.DOCTOR)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async createDoctorAvailability(
    @Req() req: AuthRequest,
    @Body() dto: CreateSlotDto,
  ) {
    const userId = req.user.userId;
    return this.bookingService.createSlots(userId, dto);
  }

  // 3. ENDPOINT: Availability Search (Open Access for guests / High Read Scale)
  // We override the global guards by placing @UseGuards() with no arguments, or by placing this endpoint in an open module.
  // For simplicity, we will assume this GET endpoint is *not* protected by the global guards if called without a token.
  @Get('slots/search')
  @Public()
  @HttpCode(HttpStatus.OK)
  async searchAvailability(
    @Query('specialty') specialty: string,
    @Query('date') date: string,
  ) {
    if (!specialty || !date) {
      throw new BadRequestException(
        'Specialty and date are required for search.',
      );
    }

    return this.bookingService.findAvailableSlots(specialty, date);
  }

  @Post('slots/book') // Endpoint: POST /booking/slots/book
  @Roles(UserRole.PATIENT) // Only PATIENTS can book appointments
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async createBooking(@Req() req: AuthRequest, @Body() dto: CreateBookingDto) {
    // Patient ID is extracted from the secure JWT token
    const patientId = req.user.userId;

    return this.bookingService.createBooking(patientId, dto);
  }
}
