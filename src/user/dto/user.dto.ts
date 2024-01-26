import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { UserModel } from '../user.model';

export class UserDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsOptional()
  favorites: [];

  constructor(userModel: UserModel) {
    this.id = String(userModel._id);
    this.email = userModel.email;
    this.name = userModel.name;
    this.isAdmin = userModel.isAdmin;
    this.favorites = userModel.favorites;
  }
}
