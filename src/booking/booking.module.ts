// src/booking/booking.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module'; // Needed to secure routes
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from './booking.entity';
import { DoctorProfile } from './doctor-profile.entity';
import { AvailabilitySlot } from './availability-slot.entity';

@Module({
  imports: [
    // 1. Link the new entities to the database connection
    TypeOrmModule.forFeature([Booking, DoctorProfile, AvailabilitySlot]),
    // 2. Import AuthModule so we can use its Guards (JwtAuthGuard, RolesGuard)
    AuthModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  // Export services if other modules will rely on them later
  exports: [BookingService],
})
export class BookingModule {}
