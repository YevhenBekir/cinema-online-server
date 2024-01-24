import { Body, Controller, Get, HttpCode, Param, Put, UsePipes, ValidationPipe } from '@nestjs/common';

import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { UserUpdateDto } from './dto/userUpdate.dto';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @Auth()
  async getProfile(@User('_id') _id: string) {
    return await this.userService.getProfile(_id);
  }

  @Get('/users-count')
  @Auth('admin')
  async getUsersCount() {
    return await this.userService.getUsersCount();
  }

  @UsePipes(new ValidationPipe())
  @Put('/update')
  @HttpCode(200)
  @Auth()
  async updateProfile(@User('_id') _id: string, @Body() userUpdateDTO: UserUpdateDto) {
    return await this.userService.updateProfile(_id, userUpdateDTO);
  }

  @UsePipes(new ValidationPipe())
  @Put('/update/:_userId')
  @HttpCode(200)
  @Auth('admin')
  async updateUser(
    @Param('_userId', IdValidationPipe) _userId: string, // Get '_userId' and validate with custom pipe for ObjectId in MongoDB
    @Body() userUpdateDTO: UserUpdateDto,
  ) {
    return await this.userService.updateProfile(_userId, userUpdateDTO);
  }
}
