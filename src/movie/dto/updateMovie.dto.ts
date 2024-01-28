import { Ref } from '@typegoose/typegoose';
import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, IsObject } from 'class-validator';
import { ActorModel } from 'src/actor/actor.model';
import { GenreModel } from 'src/genre/genre.model';

export class UpdateMovieDto {
  poster: Express.Multer.File;

  @IsOptional()
  widePoster: Express.Multer.File;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres: Ref<GenreModel>[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  actors: Ref<ActorModel>[];

  @IsOptional()
  @IsBoolean()
  isPublicToTelegram: boolean;

  @IsOptional()
  @IsNumber()
  year: number;

  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString()
  country: string;
}
