import { Ref } from '@typegoose/typegoose';
import { IsNumber } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';
import { MovieModel } from 'src/movie/movie.model';
import { UserModel } from 'src/user/user.model';
import { RatingModel } from '../rating.model';

export class RatingDto {
  @IsObjectId({ message: 'Invalid movie ID type !' })
  movie: Ref<MovieModel>;

  @IsNumber()
  rating: number;

  @IsObjectId({ message: 'Invalid user ID type !' })
  user: Ref<UserModel>;

  constructor(dto: RatingModel) {
    this.movie = dto.movie;
    this.rating = dto.rating;
    this.user = dto.user;
  }
}
