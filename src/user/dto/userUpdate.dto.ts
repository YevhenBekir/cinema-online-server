import { IsEmail, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @MinLength(6, {
    message: 'The password must contain at least 6 characters !',
  })
  @MaxLength(32, {
    message: 'Password cannot be more than 32 characters !',
  })
  password?: string;

  @IsOptional()
  isAdmin?: boolean;
}
