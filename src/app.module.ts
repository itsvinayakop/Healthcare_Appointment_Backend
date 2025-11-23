// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { CacheModule } from '@nestjs/cache-manager'; 
import * as redisStore from 'cache-manager-redis-store'; 

import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { ConsultationModule } from './consultation/consultation.module';
import { AuditModule } from './common/audit/audit.module';

@Module({
  imports: [
    
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. Set up PostgreSQL connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
    }),

    // 3. Configure Redis Caching Module (Critical for Latency/Scale)
    CacheModule.registerAsync({
      isGlobal: true, // Make Cache Manager available everywhere
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        // Host and Port are read from the .env file
        host: configService.get<string>('REDIS_HOST') || 'localhost',
        port: parseInt(configService.get<string>('REDIS_PORT') || '6379'),
        ttl: 60 * 1000, // Cache TTL (Time-To-Live) of 60 seconds
      }),
      inject: [ConfigService],
    }),

    // 4. Import application modules
    AuthModule,
    BookingModule,
    ConsultationModule,
    AuditModule,
  ],
})
export class AppModule {}
