// src/auth/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum';

@Entity('users')
export class User {
  // Use UUID for scalability (Architecture Task 3/4)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  // IMPORTANT: This column will store the hashed password (Security requirement )
  @Column()
  password: string;

  // Role for Role-Based Access Control (RBAC)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  role: UserRole;

  @Column({ default: true })
  is_active: boolean;

  // Audit trail requirement [cite: 20]
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
