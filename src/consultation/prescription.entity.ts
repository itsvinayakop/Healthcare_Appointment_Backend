import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Consultation } from './consultation.entity';

@Entity('prescriptions')
export class Prescription {
  // Primary Key is also the FK to the consultation for 1-to-1 relationship
  @PrimaryColumn('uuid')
  consultation_id: string;

  @Column('text')
  medication_details: string; // The full text of the prescription

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  issued_at: Date;

  @Column({ type: 'boolean', default: false })
  is_signed_off: boolean; // Doctor sign-off check

  // Defines the 1-to-1 relationship with the Consultation table
  @OneToOne(() => Consultation)
  @JoinColumn({ name: 'consultation_id' })
  consultation: Consultation;
}
