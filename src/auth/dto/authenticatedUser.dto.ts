import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { UserDto } from 'src/user/dto/user.dto';

export class AuthenticatedUserDto {
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

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  constructor(userDTO: UserDto, tokens: { accessToken: string; refreshToken: string }) {
    this.id = userDTO.id;
    this.email = userDTO.email;
    this.name = userDTO.name;
    this.isAdmin = userDTO.isAdmin;
    this.favorites = userDTO.favorites;
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
  }
}
