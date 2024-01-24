import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { hash, genSalt, compare } from 'bcryptjs';

import { UserModel } from '../user/user.model';
import { AuthDto } from './dto/auth.dto';
import { UserDto } from '../user/dto/user.dto';
import { AuthenticatedUserDto } from './dto/authenticatedUser.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  private async generatePassword(password: string): Promise<string> {
    const salt: string = await genSalt(5);
    return await hash(password, salt);
  }

  async register(authDTO: AuthDto): Promise<AuthenticatedUserDto> {
    const isUserExist: UserModel = await this.userModel.findOne({
      email: authDTO.email,
    });
    if (isUserExist) {
      throw new BadRequestException(`User with email - ${authDTO.email} is already exist !`);
    }

    const hashPassword: string = await this.generatePassword(authDTO.password);

    const user = new this.userModel({
      email: authDTO.email,
      name: authDTO.name,
      password: hashPassword,
    });
    await user.save();

    const userDTO: UserDto = new UserDto(user);

    const tokens: { accessToken: string; refreshToken: string } = await this.generateTokens(
      userDTO.id,
    );

    const authenticatedUserDTO: AuthenticatedUserDto = new AuthenticatedUserDto(userDTO, tokens);

    return authenticatedUserDTO;
  }

  async login(dto: AuthDto): Promise<AuthenticatedUserDto> {
    const user: UserModel = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new BadRequestException(`User with email - ${dto.email} is not found !`);
    }

    const isValidPassword: boolean = await compare(dto.password, user.password);
    if (!isValidPassword) {
      throw new BadRequestException(`Invalid password !`);
    }

    const userDTO: UserDto = new UserDto(user);

    const tokens: { accessToken: string; refreshToken: string } = await this.generateTokens(
      userDTO.id,
    );

    const authenticatedUserDTO: AuthenticatedUserDto = new AuthenticatedUserDto(userDTO, tokens);

    return authenticatedUserDTO;
  }

  async generateTokens(userID: string): Promise<{ accessToken: string; refreshToken: string }> {
    const data: object = { _id: userID };

    const accessToken: string = await this.jwtService.signAsync(data, {
      expiresIn: '30m',
    });
    const refreshToken: string = await this.jwtService.signAsync(data, {
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async getNewTokens({
    refreshToken,
  }: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Token not received !');
    }

    const verifiedRefreshToken = await this.jwtService.verifyAsync(refreshToken);
    if (!verifiedRefreshToken) {
      throw new UnauthorizedException('The token is invalid or expired !');
    }

    const user: UserModel = await this.userModel.findOne({
      _id: verifiedRefreshToken._id,
    });

    const tokens: { accessToken: string; refreshToken: string } = await this.generateTokens(
      String(user._id),
    );

    return tokens;
  }
}
