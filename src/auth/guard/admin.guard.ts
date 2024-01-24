import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserModel } from 'src/user/user.model';

export class AdminGuard implements CanActivate {
  // This is custom guard for check if user == admin. Each custom guard must:
  //     implements - CanActivate class,
  //     contain - constructor(private reflector: Reflector) {}
  //     contain - canActivate(context: ExecutionContext): boolean {}

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: UserModel }>(); // in 'request' variable is http request data

    const user = request.user;

    if (!user.isAdmin) {
      throw new ForbiddenException('You do not have enough access !');
    }

    return user.isAdmin;
  }
}
