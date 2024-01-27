import { IsString, IsOptional } from 'class-validator';

import { ActorModel } from '../actor.model';

export class ActorDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  image: string;

  constructor(actor: ActorModel) {
    this.id = String(actor._id);
    this.name = actor.name;
    this.surname = actor.surname;
    this.slug = actor.slug;
    this.image = actor.image;
  }
}
