// src/common/audit/audit.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from './audit.service';
import { AuditLog } from './audit-log-entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditService],
  // CRITICAL: Export the service so other modules (ConsultationService) can use it
  exports: [AuditService],
})
export class AuditModule {}
