// src/consultation/consultation.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultationController } from './consultation.controller';
import { ConsultationService } from './consultation.service';
import { Consultation } from './consultation.entity';
import { Prescription } from './prescription.entity';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../common/audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consultation, Prescription]),

    AuthModule,

    AuditModule,
  ],
  controllers: [ConsultationController],
  providers: [ConsultationService],
  exports: [ConsultationService],
})
export class ConsultationModule {}
