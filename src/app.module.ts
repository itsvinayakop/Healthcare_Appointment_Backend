// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1. Load .env variables globally
    ConfigModule.forRoot({ isGlobal: true }), 
    
    // 2. Set up PostgreSQL connection (This provides the DataSource)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Or 'postgres' if running NestJS inside Docker later
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),      
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      // IMPORTANT: Tell TypeORM where to find entities, or use autoLoadEntities
      autoLoadEntities: true, 
      synchronize: true, // Use false and migrations in production!
    }),
    
    // 3. Import the Auth Module
    AuthModule,
  ],
})
export class AppModule {}