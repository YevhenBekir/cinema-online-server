export class UserDto {
    email: string;
    name: string;
    isAdmin: boolean;
    favorites: [];

    constructor(email: string, name: string, isAdmin: boolean, favorites: []) {
        this.email = email;
        this.name = name;
        this.isAdmin = isAdmin;
        this.favorites = favorites;
    }
}