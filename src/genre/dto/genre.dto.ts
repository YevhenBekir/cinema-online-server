import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { GenreModel } from '../genre.model';

export class GenreDto {
  @IsString()
  id: string;

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
    this.id = String(genreModel._id);
    this.name = genreModel.name;
    this.slug = genreModel.slug;
    this.description = genreModel.description;
    this.icon = genreModel.icon;
    this.isSensitive = genreModel.isSensitive;
  }
}
