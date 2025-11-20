// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../common/enums/user-role.enum'; // Path to your UserRole enum

// Define the structure of the token's payload
export interface JwtPayload {
  sub: string; // User ID (Mapped from sub claim in JWT)
  email: string;
  role: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // 1. Runtime Safety Check (Senior practice)
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined. Check your .env file.');
    }

    super({
      // 2. Configuration Options
      // Looks for the token in the Authorization: Bearer <token> header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      
      // FIX: Use the non-null assertion operator (!) on JWT_SECRET to resolve TypeScript error
      secretOrKey: process.env.JWT_SECRET!, 
      
      // We will let the token expire after the signOptions time (e.g., 7d)
      ignoreExpiration: false, 
    });
  }

  // This function is executed if the token is valid (signature and expiration check passes)
  async validate(payload: JwtPayload) {
    // The returned object is attached to the request as req.user
    return { 
      userId: payload.sub, 
      email: payload.email, 
      role: payload.role 
    };
  }
}