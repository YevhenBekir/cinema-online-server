import { UserDto } from 'src/user/dto/user.dto';

export class AuthenticatedUserDto {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  favorites: [];
  accessToken: string;
  refreshToken: string;

  constructor(
    userDTO: UserDto,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    this.id = userDTO.id;
    this.email = userDTO.email;
    this.name = userDTO.name;
    this.isAdmin = userDTO.isAdmin;
    this.favorites = userDTO.favorites;
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
  }
}
