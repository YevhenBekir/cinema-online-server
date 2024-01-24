import { Controller, Get, Param } from '@nestjs/common';

import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from './decorators/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  @Auth()
  async getById(@User('_id') _id: string) {
    return await this.userService.getById(_id);
  }
}
