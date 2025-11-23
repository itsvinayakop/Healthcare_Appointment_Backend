// src/consultation/dto/prescription.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PrescriptionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  medicationDetails: string; // The full text of the prescription/notes
}
