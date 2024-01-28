import { IsString, IsNumber, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class CreateMovieDto {
  poster: Express.Multer.File;

  @IsOptional()
  widePoster: Express.Multer.File;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  slug: string;

  movie: Express.Multer.File;

  @IsOptional()
  @IsNumber()
  rating: number;

  @IsArray()
  @IsString({ each: true }) // Each of elements will be of string type
  genres: string[];

  @IsArray()
  @IsString({ each: true })
  actors: string[];

  @IsOptional()
  @IsBoolean()
  isPublicToTelegram: boolean;

  @IsNumber()
  year: number;

  @IsNumber()
  duration: number;

  @IsString()
  country: string;
}
