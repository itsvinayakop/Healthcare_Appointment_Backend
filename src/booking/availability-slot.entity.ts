import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DoctorProfile } from './doctor-profile.entity';

export enum SlotStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  CANCELLED = 'cancelled',
}

@Entity('availability_slots')
export class AvailabilitySlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  doctor_id: string; // Foreign Key

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  end_time: Date;

  @Column({ type: 'enum', enum: SlotStatus, default: SlotStatus.AVAILABLE })
  status: SlotStatus;

  // Defines the Many-to-One relationship with the DoctorProfile
  @ManyToOne(() => DoctorProfile, (profile) => profile.user_id)
  @JoinColumn({ name: 'doctor_id' })
  doctorProfile: DoctorProfile;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
