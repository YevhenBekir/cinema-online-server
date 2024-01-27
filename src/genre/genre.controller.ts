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
import { Auth } from '../auth/decorators/auth.decorator';
import { GenreDto } from './dto/genre.dto';
import { IdValidationPipe } from '../pipes/id.validation.pipe';
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
  async getBySlug(@Param('slug') slug: string) {
    return await this.genreService.getBySlug(slug);
  }

  @Get('/id/:_id')
  @Auth('admin')
  @UsePipes(new ValidationPipe())
  async getById(@Param('_id', IdValidationPipe) _id: string) {
    return await this.genreService.getById(_id);
  }

  @Get('/count')
  @Auth('admin')
  async getCount() {
    return await this.genreService.getCount();
  }

  @Post('/add')
  @HttpCode(200)
  @Auth('admin')
  async addGenre(@Body() genreDTO: GenreDto) {
    return await this.genreService.addGenre(genreDTO);
  }

  @Put('/update/:_id')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth('admin')
  async updateGenre(@Param('_id') _id: string, @Body() genreDTO: UpdateGenreDto) {
    return await this.genreService.updateGenre(_id, genreDTO);
  }

  @Delete('/delete/:_id')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth('admin')
  async removeGenre(@Param('_id', IdValidationPipe) _id: string) {
    return await this.genreService.removeGenre(_id);
  }
}
