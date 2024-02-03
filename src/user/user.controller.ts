import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UserService } from './user.service';
import { Auth } from '../common/decorators/auth.decorator';
import { User } from '../common/decorators/user.decorator';
import { UserUpdateDto } from './dto/userUpdate.dto';
import { IdValidationPipe } from 'src/common/pipes/id.validation.pipe';
import { Types } from 'mongoose';
import { UserModel } from './user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/count')
  @Auth('admin')
  async getUsersCount() {
    return await this.userService.getUsersCount();
  }

  @Get('/all')
  @Auth('admin')
  async getAllUsers(@Query('searchTerm') searchTerm?: string) {
    return await this.userService.getAllUsers(searchTerm);
  }

  @Get('/profile')
  @Auth()
  async getProfile(@User('_id', IdValidationPipe) _id: Types.ObjectId) {
    return await this.userService.getProfile(_id);
  }

  @Get('/profile/:_userId')
  @Auth('admin')
  async getUserProfile(@Param('_userId', IdValidationPipe) _userId: Types.ObjectId) {
    // Get user's profile by admin
    return await this.userService.getProfile(_userId);
  }

  @Put('/update')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  async updateProfile(
    @User('_id', IdValidationPipe) _id: Types.ObjectId,
    @Body() userUpdateDTO: UserUpdateDto,
  ) {
    return await this.userService.updateProfile(_id, userUpdateDTO);
  }

  @Put('/toggle-favorite/:_movieId')
  @HttpCode(200)
  @Auth()
  async toggleFavorite(
    @User() user: UserModel,
    @Param('_movieId', IdValidationPipe) _movieId: Types.ObjectId,
  ) {
    return await this.userService.toggleFavorite(user, _movieId);
  }

  @Get('/favorites')
  @Auth()
  async getFavorites(@User('_id') _id: Types.ObjectId) {
    return await this.userService.getFavorites(_id);
  }

  @Put('/update/:_userId')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth('admin')
  async updateUserProfile(
    @Param('_userId', IdValidationPipe) _userId: Types.ObjectId, // Get '_userId' and validate with custom pipe for ObjectId in MongoDB
    @Body() userUpdateDTO: UserUpdateDto,
  ) {
    return await this.userService.updateProfile(_userId, userUpdateDTO);
  }

  @Delete('/delete/:_userId')
  @HttpCode(200)
  @Auth('admin')
  async deleteUser(@Param('_userId', IdValidationPipe) _userId: string) {
    return await this.userService.deleteUser(_userId);
  }
}
