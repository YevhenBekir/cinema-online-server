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
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { MovieService } from './movie.service';
import { Auth } from '../common/decorators/auth.decorator';
import { IdValidationPipe } from 'src/common/pipes/id.validation.pipe';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateMovieDto } from './dto/createMovie.dto';
import { UpdateMovieDto } from './dto/updateMovie.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/all')
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return await this.movieService.getAll(searchTerm);
  }

  @Get('/slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return await this.movieService.bySlug(slug);
  }

  @Post('/genre-ids')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async byGenreIds(@Body('genreIds') genreIds: Types.ObjectId[]) {
    return await this.movieService.byGenreIds(genreIds);
  }

  @Get('/actor/:id')
  async byActorId(@Param('id', IdValidationPipe) id: Types.ObjectId) {
    return await this.movieService.byActorId(id);
  }

  @Put('/update-count')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async updateCountOpened(@Body('slug') slug: string) {
    return await this.movieService.updateCountOpened(slug);
  }

  @Get('/most-popular')
  async getMostPopular() {
    return await this.movieService.getMostPopular();
  }

  // Admin
  @Get('/id/:_id')
  @Auth('admin')
  async byId(@Param('_id', IdValidationPipe) _id: Types.ObjectId) {
    return await this.movieService.byId(_id);
  }

  @Post('/create')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'movie', maxCount: 1 },
      { name: 'poster', maxCount: 1 },
      { name: 'widePoster', maxCount: 1 },
    ]),
  )
  @HttpCode(200)
  @Auth('admin')
  async create(@Body() movieDTO: CreateMovieDto, @UploadedFiles() files) {
    Object.assign(movieDTO, {
      movie: files.movie[0] || movieDTO.movie,
      poster: files.poster[0] || movieDTO.poster,
      widePoster: files.widePoster[0] || movieDTO.widePoster,
    });

    return await this.movieService.create(movieDTO);
  }

  @Put('/update/:_id')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'poster', maxCount: 1 },
      { name: 'widePoster', maxCount: 1 },
    ]),
  )
  @HttpCode(200)
  @Auth('admin')
  async update(
    @Param('_id', IdValidationPipe) _id: Types.ObjectId,
    @Body() movieDTO: UpdateMovieDto,
    @UploadedFiles() files,
  ) {
    const poster = files.poster ? files.poster[0] : null;
    const widePoster = files.widePoster ? files.widePoster[0] : null;

    Object.assign(movieDTO, {
      poster: poster || movieDTO.poster,
      widePoster: widePoster || movieDTO.widePoster,
    });

    return await this.movieService.update(_id, movieDTO);
  }

  @Delete('/delete/:_id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('_id', IdValidationPipe) _id: Types.ObjectId) {
    return await this.movieService.delete(_id);
  }
}
