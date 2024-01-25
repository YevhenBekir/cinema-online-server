import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { compare, genSalt, hash } from 'bcryptjs';
import { Document } from 'mongoose';

import { UserModel } from './user.model';
import { UserDto } from './dto/user.dto';
import { UserUpdateDto } from './dto/userUpdate.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {}

  private async generatePassword(password: string): Promise<string> {
    const salt: string = await genSalt(5);

    return await hash(password, salt);
  }

  private async comparePasswords(newPassword: string, currentPassword: string): Promise<boolean> {
    const isPasswordsAreSimilar: boolean = await compare(newPassword, currentPassword);
    if (isPasswordsAreSimilar) {
      throw new BadRequestException('The new password must be different from the previous one !');
    }

    return isPasswordsAreSimilar;
  }

  private async findUserById(_id: string): Promise<UserModel & Document> {
    if (!_id) {
      throw new BadRequestException("User's id not received !");
    }

    const user: UserModel & Document = await this.userModel.findById(_id);
    if (!user) {
      throw new NotFoundException('User not found !');
    }

    return user;
  }

  private async isEmailAlreadyExist(email: string): Promise<void> {
    const isEmailExist: UserModel = await this.userModel.findOne({ email });

    if (isEmailExist) {
      throw new BadRequestException(`User with email - ${email} already exist !`);
    }
  }

  async getUsersCount(): Promise<number> {
    return await this.userModel.find().countDocuments().exec();
  }

  async getProfile(_id: string): Promise<UserDto> {
    const user: UserModel & Document = await this.findUserById(_id);
    const userDTO: UserDto = new UserDto(user);

    return userDTO;
  }

  async getAllUsers(searchTerm: string): Promise<UserDto[]> {
    let filter: object = {};

    if (searchTerm) {
      filter = {
        $or: [{ email: new RegExp(searchTerm, 'i') }, { name: new RegExp(searchTerm, 'i') }],
      };
    }

    const result: UserModel[] = await this.userModel
      .find(filter)
      .sort({
        createdAt: 'desc', // Sorting for new users
      })
      .exec();

    if (result.length === 0) {
      throw new NotFoundException('No users found !');
    }

    const usersDTO: UserDto[] = result.map((user) => new UserDto(user));

    return usersDTO;
  }

  async updateProfile(_id: string, { email, name, password, isAdmin }: UserUpdateDto): Promise<UserDto> {
    const user: UserModel & Document = await this.findUserById(_id);
    await this.isEmailAlreadyExist(email);

    if (email) user.email = email;
    if (name) user.name = name;
    if (password) {
      const isPasswordsAreSimilar: boolean = await this.comparePasswords(password, user.password);
      const hashedPassword: string = await this.generatePassword(password);

      !isPasswordsAreSimilar ? (user.password = hashedPassword) : '';
    }
    if (isAdmin || isAdmin === false) user.isAdmin = isAdmin;

    await user.save();

    return new UserDto(user);
  }

  async deleteUser(_id: string): Promise<UserModel | null> {
    return await this.userModel.findByIdAndDelete(_id).exec();
  }
}
