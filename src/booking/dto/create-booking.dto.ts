// src/booking/dto/create-booking.dto.ts
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  slotId: string;
}
