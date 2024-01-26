import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';

export interface GenreModel extends Base {}

export class GenreModel extends TimeStamps {
  @prop()
  name: string;

  @prop({ unique: true })
  slug: string;

  @prop({ default: '' })
  description: string;

  @prop({ default: '' })
  icon: string;

  @prop({ default: false })
  isSensitive: boolean;
}
