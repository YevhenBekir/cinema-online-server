import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ModelType} from "@typegoose/typegoose/lib/types";
import {hash, genSalt, compare} from "bcryptjs";

import {UserModel} from "../user/user.model";
import {AuthDto} from "./dto/auth.dto";
import {UserDto} from "../user/dto/user.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>
    ) {
    }

    async generatePassword(password: string): Promise<string> {
        const salt: string = await genSalt(5);
        return await hash(password, salt);
    }

    async register(dto: AuthDto): Promise<UserDto> {
        const isUserExist: UserModel = await this.userModel.findOne({email: dto.email})
        if (isUserExist) {
            throw new BadRequestException(`User with email - ${dto.email} is already exist !`);
        }

        const hashPassword: string = await this.generatePassword(dto.password)

        const user = new this.userModel({
            email: dto.email,
            name: dto.name,
            password: hashPassword,
        });
        await user.save()

        return new UserDto(user.email, user.name, user.isAdmin, user.favorites);
    }

    async login(dto: AuthDto): Promise<UserDto> {
        const user: UserModel = await this.userModel.findOne({email: dto.email})
        if (!user) {
            throw new BadRequestException(`User with email - ${dto.email} is not found !`);
        }

        const isValidPassword: boolean = await compare(dto.password, user.password);
        if (!isValidPassword) {
            throw new BadRequestException(`Invalid password !`);
        }

        return new UserDto(user.email, user.name, user.isAdmin, user.favorites);
    }
}
