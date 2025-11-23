// src/booking/dto/create-slot.dto.ts
import { IsNotEmpty, IsISO8601 } from 'class-validator';

export class CreateSlotDto {
  // Use ISO 8601 string format for easy conversion to Date objects
  @IsISO8601()
  @IsNotEmpty()
  startTime: string;

  @IsISO8601()
  @IsNotEmpty()
  endTime: string;
}
