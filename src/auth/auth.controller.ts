import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe()) // For validate DTO using class validator
  @HttpCode(200) // Return 200 status code if success (default - 201)
  @Post('/register')
  async register(@Body() authDTO: AuthDto) {
    return await this.authService.register(authDTO);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/tokens')
  async getNewTokens(@Body() refreshToken: RefreshTokenDto) {
    return await this.authService.getNewTokens(refreshToken);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/login')
  async login(@Body() dto: any) {
    return await this.authService.login(dto);
  }
}
