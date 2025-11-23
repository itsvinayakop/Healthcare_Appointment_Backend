import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Booking } from '../booking/booking.entity'; // Import Booking entity
import { Prescription } from './prescription.entity'; // Import Prescription entity

export enum ConsultationStatus {
  INITIATED = 'initiated',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

@Entity('consultations')
export class Consultation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  booking_id: string; // FK to the Booking record

  @Column({
    type: 'enum',
    enum: ConsultationStatus,
    default: ConsultationStatus.INITIATED,
  })
  status: ConsultationStatus;

  @Column({ type: 'timestamp', nullable: true })
  start_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_time: Date;

  // Defines the 1-to-1 relationship with the Booking table
  @OneToOne(() => Booking)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  // Relationship to Prescriptions (One Consultation can have one Prescription)
  @OneToOne(() => Prescription, (prescription) => prescription.consultation)
  prescription: Prescription;
}
