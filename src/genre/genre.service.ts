import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { Document } from 'mongoose';

import { GenreModel } from './genre.model';
import { GenreDto } from './dto/genre.dto';
import { UpdateGenreDto } from './dto/updateGenre.dto';

@Injectable()
export class GenreService {
  constructor(@InjectModel(GenreModel) private readonly genreModel: ModelType<GenreModel>) {}

  private async findGenre(searchTerm: string): Promise<boolean> {
    let filter: object = {};

    if (searchTerm) {
      filter = {
        $or: [
          { name: new RegExp(searchTerm, 'i') },
          { description: new RegExp(searchTerm, 'i') },
          { slug: new RegExp(searchTerm, 'i') },
        ],
      };
    }

    const genres: GenreModel[] = await this.genreModel.find(filter).sort({
      createdAt: 'desc',
    });

    if (!genres.length) {
      return false;
    }

    return true;
  }

  async getCount(): Promise<number> {
    return await this.genreModel.find().countDocuments();
  }

  async getAll(searchTerm: string = ''): Promise<GenreDto[]> {
    let filter: object = {};

    if (searchTerm) {
      filter = {
        $or: [
          { name: new RegExp(searchTerm, 'i') },
          { description: new RegExp(searchTerm, 'i') },
          { slug: new RegExp(searchTerm, 'i') },
        ],
      };
    }

    const genres: GenreModel[] = await this.genreModel.find(filter).sort({
      createdAt: 'desc',
    });

    if (!genres.length) {
      throw new NotFoundException('No genres found !');
    }

    return genres.map((genre) => new GenreDto(genre));
  }

  async getCollections() {
    const genres: GenreDto[] = await this.getAll();

    // TODO: Need to collections return
    let collections = genres;

    return collections;
  }

  async byId(_id: string): Promise<GenreDto> {
    const genre: GenreModel = await this.genreModel.findById(_id);
    if (!genre) {
      throw new NotFoundException('No genre found !');
    }

    return new GenreDto(genre);
  }

  async bySlug(slug: string): Promise<GenreDto> {
    const genre: GenreModel = await this.genreModel.findOne({ slug });

    return new GenreDto(genre);
  }

  async create({ name, description, slug, icon, isSensitive }: GenreDto): Promise<GenreDto> {
    const isExist: boolean = await this.findGenre(name);
    if (isExist) {
      throw new BadRequestException(`${name} genre already exist !`);
    }

    const genre: GenreModel & Document = new this.genreModel({
      name,
      slug,
    });

    if (description) genre.description = description;
    if (icon) genre.icon = icon;
    if (isSensitive) genre.isSensitive = isSensitive;
    await genre.save();

    return new GenreDto(genre);
  }

  async update(_id: string, genreDTO: UpdateGenreDto): Promise<GenreDto> {
    // This typegoose method will find necessary element in DB and update it (if exist)
    const updatedGenre: GenreDto = await this.genreModel.findByIdAndUpdate(_id, genreDTO, {
      new: true,
    });

    if (!updatedGenre) {
      throw new NotFoundException('No genre found !');
    }

    return updatedGenre;
  }

  async delete(_id: string): Promise<GenreModel> {
    return await this.genreModel.findByIdAndDelete(_id);
  }
}
