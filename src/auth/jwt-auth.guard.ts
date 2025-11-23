// src/auth/jwt-auth.guard.ts (Update this file)
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core'; // <-- NEW: Required to read metadata
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator'; // <-- NEW: Import the key

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 1. Check for the @Public() decorator on the handler or class
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. If the route is marked public, allow access immediately, bypassing JWT check
    if (isPublic) {
      return true;
    }

    // 3. If not public, proceed with standard JWT authentication check
    return super.canActivate(context);
  }
}
