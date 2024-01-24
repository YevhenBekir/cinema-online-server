import { UseGuards, applyDecorators } from '@nestjs/common';
import { RoleType } from '../auth.interface';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { AdminGuard } from '../guard/admin.guard';

export const Auth = (role: RoleType = 'user') =>
  applyDecorators(role === 'admin' ? UseGuards(JwtAuthGuard, AdminGuard) : UseGuards(JwtAuthGuard));

// This is custom decorator, which will use necessary guard.
// If in controller call @Auth("admin") - decorator will use 'JwtAuthGuard' and 'AdminGuard' guards
// If in controller call just @Auth() or @Auth("user") - decorator will use only 'JwtAuthGuard' guard
