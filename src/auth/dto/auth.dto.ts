import { IsString, IsEmail, MinLength, MaxLength, IsOptional } from 'class-validator'; // Validator to DTO variables

export class AuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  name: string;

  @MinLength(6, {
    message: 'The password must contain at least 6 characters !',
  })
  @MaxLength(32, {
    message: 'Password cannot be more than 32 characters !',
  })
  password: string;
}
