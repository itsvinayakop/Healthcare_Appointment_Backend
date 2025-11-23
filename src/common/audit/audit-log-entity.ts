import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string; // Who performed the action

  @Column()
  event_type: string; // e.g., BOOKING_CONFIRMED, PRESCRIPTION_FILED

  @Column('jsonb')
  payload: object; // Immutable data regarding the event

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
