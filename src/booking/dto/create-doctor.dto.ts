// src/booking/dto/create-doctor.dto.ts
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @IsNumber()
  @Min(0, { message: 'Fees must be non-negative.' })
  fees: number;
}
