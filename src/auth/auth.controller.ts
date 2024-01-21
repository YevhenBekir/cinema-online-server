import {Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, HttpException, HttpStatus} from '@nestjs/common';

import {AuthService} from "./auth.service";
import {AuthDto} from "./dto/auth.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @UsePipes(new ValidationPipe()) // For validate DTO using class validator
    @HttpCode(200)  // Return 200 status code if success (default - 201)
    @Post('/register')
    async register(@Body() dto: AuthDto) {
        return await this.authService.register(dto);
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('/login')
    async login(@Body() dto: any) {
        return this.authService.login(dto);
    }
}
