// src/consultation/consultation.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  Param,
} from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { ConsultationIdDto } from './dto/consultation-id.dto';
import { PrescriptionDto } from './dto/prescription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { AuthRequest } from '../auth/interfaces/auth-user.interface';

@Controller('consultation')
@UseGuards(JwtAuthGuard, RolesGuard) // Global guards for protected actions
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  // 1. API: Start Consultation Session
  @Post('start')
  @Roles(UserRole.DOCTOR)
  @HttpCode(HttpStatus.OK)
  async startConsultation(
    @Req() req: AuthRequest,
    @Body() dto: ConsultationIdDto,
  ) {
    return this.consultationService.startConsultation(req.user.userId, dto);
  }

  // 2. API: Submit Prescription and End Session
  // We use the booking ID in the URL path to identify the session
  @Post(':bookingId/prescription')
  @Roles(UserRole.DOCTOR)
  @HttpCode(HttpStatus.CREATED)
  async submitPrescription(
    @Req() req: AuthRequest,
    @Param('bookingId') bookingId: string,
    @Body() dto: PrescriptionDto,
  ) {
    return this.consultationService.submitPrescription(
      req.user.userId,
      bookingId,
      dto,
    );
  }
}
