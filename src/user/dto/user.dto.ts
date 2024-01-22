

export class UserDto {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
    favorites: [];

    constructor(id: string, email: string, name: string, isAdmin: boolean, favorites: []) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.isAdmin = isAdmin;
        this.favorites = favorites;
    }
}