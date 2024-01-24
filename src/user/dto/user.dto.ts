import { UserModel } from '../user.model';

export class UserDto {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  favorites: [];

  constructor(userModel: UserModel) {
    this.id = String(userModel._id);
    this.email = userModel.email;
    this.name = userModel.name;
    this.isAdmin = userModel.isAdmin;
    this.favorites = userModel.favorites;
  }
}
