// src/auth/jwt-auth.guard.ts
import { AuthGuard } from '@nestjs/passport';

// This applies the 'jwt' strategy defined in jwt.strategy.ts
export class JwtAuthGuard extends AuthGuard('jwt') {}