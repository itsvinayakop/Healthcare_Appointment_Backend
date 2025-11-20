// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from '../common/enums/user-role.enum'; // Path to your enum

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 1. Get the required role(s) from the route handler metadata (@Roles() decorator)
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles defined, access is allowed
    }

    // 2. Get the authenticated user object (injected by the JWT strategy into req.user)
    const { user } = context.switchToHttp().getRequest();

    // 3. Check if the user's role is in the list of required roles
    return requiredRoles.some((role) => user.role === role);
  }
}