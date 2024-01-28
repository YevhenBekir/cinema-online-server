import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ActorService } from './actor.service';
import { CreateActorDto } from './dto/createActor.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { IdValidationPipe } from '../pipes/id.validation.pipe';

@Controller('actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get('/all')
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return await this.actorService.getAll(searchTerm);
  }

  @Get('/slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return await this.actorService.bySlug(slug);
  }

  @Get('/id/:_id')
  @Auth('admin')
  async byId(@Param('_id', IdValidationPipe) _id: string) {
    return await this.actorService.byId(_id);
  }

  @Post('/create')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  @Auth('admin')
  async create(@Body() actorDTO: CreateActorDto, @UploadedFile() file?: Express.Multer.File) {
    Object.assign(actorDTO, {
      image: file || actorDTO.image,
    });

    return await this.actorService.create(actorDTO);
  }

  @Put('/change-image/:_id')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  @Auth('admin')
  async changeImage(@Param('_id', IdValidationPipe) _id: string, @UploadedFile() file: Express.Multer.File) {
    return await this.actorService.changeImage(_id, file);
  }

  @Delete('/delete/:_id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('_id', IdValidationPipe) _id: string) {
    return await this.actorService.delete(_id);
  }
}
