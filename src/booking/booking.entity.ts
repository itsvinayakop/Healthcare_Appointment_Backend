import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { AvailabilitySlot } from './availability-slot.entity';

export enum BookingStatus {
  CONFIRMED = 'confirmed',
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patient_id: string; // FK to the patient in the User table

  @Column('uuid')
  slot_id: string; // FK to the booked slot

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.SCHEDULED,
  })
  status: BookingStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  booked_at: Date;

  // Relationships
  @ManyToOne(() => User)
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @ManyToOne(() => AvailabilitySlot)
  @JoinColumn({ name: 'slot_id' })
  slot: AvailabilitySlot;
}
