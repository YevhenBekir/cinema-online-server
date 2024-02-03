import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

import { ActorModel } from './actor.model';
import { ActorDto } from './dto/actor.dto';
import { CreateActorDto } from './dto/createActor.dto';
import { FileService } from '../file/file.service';
import { FileResponse } from '../file/file.interface';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(ActorModel) private readonly actorModel: ModelType<ActorModel>,
    private readonly fileService: FileService,
  ) {}

  private isFound(actor: ActorModel | ActorModel[]): void {
    if (Array.isArray(actor)) {
      if (!actor.length) {
        throw new NotFoundException('No actors found !');
      }
    } else {
      if (!actor) {
        throw new NotFoundException('No actor found !');
      }
    }
  }

  private async isExist(slug: string): Promise<void> {
    const actor: ActorModel = await this.actorModel.findOne({ slug });
    if (actor) {
      throw new BadRequestException('Actor already exist !');
    }
  }

  async getAll(searchTerm?: string): Promise<ActorDto[]> {
    let filter: object = {};

    if (searchTerm) {
      filter = {
        $or: [
          { name: new RegExp(searchTerm, 'i') },
          { surname: new RegExp(searchTerm, 'i') },
          { slug: new RegExp(searchTerm, 'i') },
        ],
      };
    }

    // Without aggregation
    // const actors: ActorModel[] = await this.actorModel.find(filter).sort({
    //   createdAt: 'desc',
    // });

    const actors = await this.actorModel
      .aggregate() // making aggregation request
      .match(filter) // filtering aggregation
      .lookup({
        // combines data (elements) from 'Movie' document where Movie.element.actors[...] == currentActor._id. Saving data in new 'movies' column
        from: 'Movie',
        foreignField: 'actors',
        localField: '_id',
        as: 'movies',
      })
      .addFields({
        // creation new 'moviesCount' where length of new 'movies' column (movies amount)
        moviesCount: {
          $size: '$movies',
        },
      })
      .sort({ createdAt: -1 }); // sorting from newer to oldest actors

    this.isFound(actors);

    return actors.map((actor) => new ActorDto(actor));
  }

  async byId(_id: string): Promise<ActorDto> {
    const actor: ActorModel = await this.actorModel.findById(_id);
    this.isFound(actor);

    return new ActorDto(actor);
  }

  async bySlug(slug: string): Promise<ActorDto> {
    const actor = await this.actorModel.findOne({ slug });
    this.isFound(actor);

    return new ActorDto(actor);
  }

  async create(actorDTO: CreateActorDto): Promise<ActorDto | void> {
    await this.isExist(actorDTO.slug);

    let actorImage: FileResponse | undefined;
    if (actorDTO.image) {
      actorImage = await this.fileService.uploadSingleFile(actorDTO.image, 'images');
    }

    const actor = new this.actorModel({
      name: actorDTO.name,
      surname: actorDTO.surname,
      slug: actorDTO.slug,
      image: actorImage ? actorImage.url : '',
    });
    await actor.save();

    return new ActorDto(actor);
  }

  async changeImage(_id: string, image: Express.Multer.File): Promise<ActorDto> {
    const actor = await this.actorModel.findById(_id);
    if (!actor) {
      throw new NotFoundException('No actor found !');
    }

    await this.fileService.deleteFile(actor.image);
    const actorImage: FileResponse = await this.fileService.uploadSingleFile(image, 'images');

    actor.image = actorImage.url;
    await actor.save();

    return new ActorDto(actor);
  }

  async delete(_id: string): Promise<ActorModel> {
    return await this.actorModel.findByIdAndDelete(_id);
  }
}
