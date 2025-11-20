// src/auth/auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto'; // <-- NEW: Import Login DTO
import { User } from './user.entity';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    // DI: Inject the User repository for database access
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    // Inject the JWT service for token generation
    private jwtService: JwtService,
  ) {}

  // --- REGISTRATION METHOD (Existing) ---
  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password } = registerDto;

    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      role: UserRole.PATIENT, 
    });

    return this.usersRepository.save(newUser);
  }

  // --- LOGIN METHOD (NEWLY ADDED) ---
  async login(loginDto: LoginDto): Promise<{ token: string; user: Partial<User> }> {
    const { email, password } = loginDto;

    // 1. Find the user by email
    // IMPORTANT: Ensure the entity query will fetch the password hash (default for TypeORM)
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('Invalid credentials.');
    }

    // 2. Compare the hashed password (Security)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials.');
    }

    // 3. Generate the payload for the token
    const payload = { 
      sub: user.id, // Subject (user ID)
      email: user.email, 
      role: user.role 
    };

    // 4. Generate the JWT (The token is signed using the secret defined in AuthModule)
    const token = await this.jwtService.signAsync(payload);

    // 5. Return the token and safe user details (excluding password hash)
    const { password: pw, ...safeUser } = user;
    return { token, user: safeUser };
  }
}