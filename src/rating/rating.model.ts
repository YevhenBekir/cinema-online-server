import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

import { UserModel } from 'src/user/user.model';
import { MovieModel } from 'src/movie/movie.model';

export interface RatingModel extends Base {}

export class RatingModel extends TimeStamps {
  @prop({ ref: () => MovieModel })
  movie: Ref<MovieModel>;

  @prop({ default: 0 })
  rating: number;

  @prop({ ref: () => UserModel })
  user: Ref<UserModel>;
}
