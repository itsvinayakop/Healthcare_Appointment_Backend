import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
// Import User entity from its location
import { User } from '../auth/user.entity'; 

@Entity('doctor_profiles')
export class DoctorProfile {
    // Foreign Key (FK) is also the Primary Key (PK) for a 1-to-1 relationship
    @PrimaryColumn('uuid') 
    user_id: string;

    @Column()
    specialty: string; // e.g., 'Ayurveda', 'General'

    @Column('numeric')
    fees: number; // For easy calculations

    // Defines the 1-to-1 relationship with the User table
    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}