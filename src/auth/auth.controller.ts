// src/auth/auth.controller.ts
import { 
    Controller, 
    Post, 
    Body, 
    UsePipes, 
    ValidationPipe, 
    HttpStatus, 
    HttpCode,
    Get,
    UseGuards,
    Req // To access the user object injected by the JWT guard
  } from '@nestjs/common';
  
  import { AuthService } from './auth.service';
  import { RegisterDto } from './dto/register.dto';
  import { LoginDto } from './dto/login.dto'; 
  import { User } from './user.entity';
  import { Request } from 'express'; // Required type for the @Req() parameter
  import { JwtService } from '@nestjs/jwt';
  
  // Imports for Security/RBAC
  import { JwtAuthGuard } from './jwt-auth.guard'; // Requires valid token
  import { RolesGuard } from './roles.guard';      // Checks user role
  import { Roles } from './roles.decorator';       // Decorator helper
  import { UserRole } from '../common/enums/user-role.enum'; // Role Enum
  @Controller('auth') // Base path is /auth
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    // 1. REGISTRATION: POST /auth/register (User Lifecycle)
    @Post('register') 
    @UsePipes(new ValidationPipe()) 
    @HttpCode(HttpStatus.CREATED) 
    async register(@Body() registerDto: RegisterDto): Promise<{ user: Partial<User> }> {
      const user = await this.authService.register(registerDto);
      
      // IMPORTANT: Never return the password hash
      const { password, ...safeUser } = user; 
      
      return { user: safeUser };
    }
  
    // 2. LOGIN: POST /auth/login (Authentication)
    @Post('login') 
    @UsePipes(new ValidationPipe())
    @HttpCode(HttpStatus.OK) // Return 200 OK on successful login
    async login(@Body() loginDto: LoginDto): Promise<{ token: string; user: Partial<User> }> {
      // Calls service to find user, check password, and generate JWT
      return this.authService.login(loginDto);
    }
  
    // 3. ADMIN TEST ENDPOINT: GET /auth/admin-dashboard (Security/RBAC Check)
    // We use multiple guards: First JwtAuthGuard, then RolesGuard.
    @Get('admin-dashboard')
    @UseGuards(JwtAuthGuard, RolesGuard) 
    @Roles(UserRole.ADMIN) // Only users with the ADMIN role can access this route
    // FIX APPLIED: Added the ': Request' type annotation to resolve the TypeScript error
    async getAdminDashboard(@Req() req: Request) { 
      // If the request reaches here, authentication and authorization were successful.
      return {
        message: 'Welcome to the Admin Dashboard (RBAC Confirmed)!',
        user: req.user, // req.user holds the payload injected by JwtStrategy
      };
    }
  }