import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Ref, prop } from '@typegoose/typegoose';
import { ActorModel } from 'src/actor/actor.model';
import { GenreModel } from 'src/genre/genre.model';

export interface MovieModel extends Base {}

export interface Parameters {
  year: number;
  duration: number;
  country: string;
}

export class MovieModel extends TimeStamps {
  @prop()
  poster: string;

  @prop()
  widePoster?: string;

  @prop()
  title: string;

  @prop()
  description: string;

  @prop({ unique: true })
  slug: string;

  @prop()
  movieUrl: string;

  @prop({ default: 0.0 })
  rating?: number;

  @prop({ default: 0 })
  countOpened?: number;

  @prop()
  parameters: Parameters;

  @prop({ ref: () => GenreModel }) // Prop is GenreModel's reference. Fox example - genres[0].isSensitive.
  genres: Ref<GenreModel>[];

  @prop({ ref: () => ActorModel })
  actors: Ref<ActorModel>[];

  @prop({ default: false })
  isPublicToTelegram?: boolean;
}
