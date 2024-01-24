import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {}

  async getProfile(_id: string): Promise<UserDto> {
    if (!_id) {
      throw new BadRequestException("User's id not received !");
    }

    const user: UserModel = await this.userModel.findById(_id);
    if (!user) {
      throw new NotFoundException('User not found !');
    }

    const userDTO: UserDto = new UserDto(user);

    return userDTO;
  }
}
