// src/auth/interfaces/auth-user.interface.ts
import { UserRole } from '../../common/enums/user-role.enum';
import { Request } from 'express';

// 1. Defines the properties added by JwtStrategy (what req.user holds)
export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

// 2. Extends Express Request to include our AuthUser
export interface AuthRequest extends Request {
  user: AuthUser;
}
