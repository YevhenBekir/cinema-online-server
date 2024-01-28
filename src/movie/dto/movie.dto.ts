import { Ref } from '@typegoose/typegoose';
import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, IsObject } from 'class-validator';
import { ActorModel } from 'src/actor/actor.model';
import { GenreModel } from 'src/genre/genre.model';
import { MovieModel } from '../movie.model';

export class Parameters {
  @IsNumber()
  year: number;

  @IsNumber()
  duration: number;

  @IsString()
  country: string;
}

export class MovieDto {
  @IsString()
  id: string;

  @IsString()
  poster: string;

  @IsOptional()
  @IsString()
  widePoster: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  slug: string;

  @IsString()
  movieUrl: string;

  @IsOptional()
  @IsNumber()
  rating: number;

  @IsOptional()
  @IsNumber()
  countOpened: number;

  @IsObject()
  parameters: Parameters;

  @IsArray()
  @IsString({ each: true }) // Each of elements will be of string type
  genres: Ref<GenreModel>[];

  @IsArray()
  @IsString({ each: true })
  actors: Ref<ActorModel>[];

  @IsOptional()
  @IsBoolean()
  isPublicToTelegram: boolean;

  constructor(movieDTO: MovieModel) {
    this.id = String(movieDTO._id);
    this.poster = movieDTO.poster;
    this.widePoster = movieDTO.widePoster;
    this.title = movieDTO.title;
    this.description = movieDTO.description;
    this.slug = movieDTO.slug;
    this.movieUrl = movieDTO.movieUrl;
    this.rating = movieDTO.rating;
    this.countOpened = movieDTO.countOpened;
    this.parameters = movieDTO.parameters;
    this.genres = movieDTO.genres;
    this.actors = movieDTO.actors;
    this.isPublicToTelegram = movieDTO.isPublicToTelegram;
  }
}
