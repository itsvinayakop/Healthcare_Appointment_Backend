// src/common/audit/audit.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log-entity';

interface AuditPayload {
  userId: string;
  eventType: string; // e.g., 'BOOKING_CONFIRMED', 'PRESCRIPTION_FILED'
  details: object;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async recordEvent(payload: AuditPayload): Promise<void> {
    console.log(
      `[AUDIT] RECEIVED ASYNC EVENT: ${payload.eventType} for User: ${payload.userId}`,
    );

    const log = this.auditLogRepository.create({
      user_id: payload.userId,
      event_type: payload.eventType,
      payload: payload.details,
    });

    await this.auditLogRepository.save(log);
  }
}
