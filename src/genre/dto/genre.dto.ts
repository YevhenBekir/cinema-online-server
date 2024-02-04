import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';

import { GenreModel } from '../genre.model';

export class GenreDto {
  @IsObjectId()
  id: Types.ObjectId;

  @IsString()
  name: string;

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

  constructor(genreModel: GenreModel) {
    this.id = genreModel._id;
    this.name = genreModel.name;
    this.slug = genreModel.slug;
    this.description = genreModel.description;
    this.icon = genreModel.icon;
    this.isSensitive = genreModel.isSensitive;
  }
}
