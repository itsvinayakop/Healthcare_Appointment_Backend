// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- IMPORTANT: ConfigService is needed

import { User } from './user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,

    // FIX HERE: Use registerAsync to guarantee JWT_SECRET is loaded by ConfigModule
    JwtModule.registerAsync({
      // Ensure ConfigModule is imported so we can access its services
      imports: [ConfigModule],

      // Inject ConfigService into the factory function
      useFactory: async (configService: ConfigService) => ({
        // Safely retrieve the secret key
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),

      // Specify that ConfigService must be injected
      inject: [ConfigService],
    }),
  ],

  // Register Controllers and Providers (same as before)
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
