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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { GenreService } from './genre.service';
import { Auth } from '../common/decorators/auth.decorator';
import { GenreDto } from './dto/genre.dto';
import { IdValidationPipe } from '../common/pipes/id.validation.pipe';
import { UpdateGenreDto } from './dto/updateGenre.dto';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('/all')
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return await this.genreService.getAll(searchTerm);
  }

  @Get('/collections')
  async getCollections() {
    return await this.genreService.getCollections();
  }

  @Get('/slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return await this.genreService.bySlug(slug);
  }

  @Get('/id/:_id')
  @Auth('admin')
  async byId(@Param('_id', IdValidationPipe) _id: string) {
    return await this.genreService.byId(_id);
  }

  @Get('/count')
  @Auth('admin')
  async getCount() {
    return await this.genreService.getCount();
  }

  @Post('/create')
  @HttpCode(200)
  @Auth('admin')
  async create(@Body() genreDTO: GenreDto) {
    return await this.genreService.create(genreDTO);
  }

  @Put('/update/:_id')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth('admin')
  async update(@Param('_id') _id: string, @Body() genreDTO: UpdateGenreDto) {
    return await this.genreService.update(_id, genreDTO);
  }

  @Delete('/delete/:_id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('_id', IdValidationPipe) _id: string) {
    return await this.genreService.delete(_id);
  }
}
