// src/consultation/dto/consultation-id.dto.ts
import { IsUUID } from 'class-validator';

export class ConsultationIdDto {
  @IsUUID()
  bookingId: string; // We use the Booking ID to start/manage the consultation
}
