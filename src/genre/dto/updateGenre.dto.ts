import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateGenreDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  icon: string;

  @IsOptional()
  @IsBoolean()
  isSensitive: boolean;
}
