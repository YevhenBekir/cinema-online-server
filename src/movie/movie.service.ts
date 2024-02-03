import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';

import { MovieModel } from './movie.model';
import { MovieDto } from './dto/movie.dto';
import { CreateMovieDto } from './dto/createMovie.dto';
import { FileResponse } from '../file/file.interface';
import { FileService } from '../file/file.service';
import { UpdateMovieDto } from './dto/updateMovie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel) private readonly movieModel: ModelType<MovieModel>,
    private readonly fileService: FileService,
  ) {}

  private isFoundMovies(movies: MovieModel[]): void {
    if (!movies.length) {
      throw new NotFoundException('No movies found !');
    }
  }

  private async isExist(slug: string) {
    const movie: MovieModel = await this.movieModel.findOne({ slug });
    if (movie) {
      throw new BadRequestException('Movie already exist !');
    }
  }

  async getAll(searchTerm?: string): Promise<MovieDto[]> {
    let filter: object = {};

    if (searchTerm) {
      filter = {
        $or: [{ title: new RegExp(searchTerm, 'i') }, { slug: new RegExp(searchTerm, 'i') }],
      };
    }

    // Find with filters but using populate() for finding actors and genres by them id in movie columns and return necessary elements from DB
    const movies: MovieModel[] = await this.movieModel
      .find(filter)
      .sort({
        createdAt: 'desc',
      })
      .populate('genres actors');
    this.isFoundMovies(movies);

    return movies.map((movie) => new MovieDto(movie));
  }

  async byId(_id: Types.ObjectId): Promise<MovieDto> {
    const movie: MovieModel = await this.movieModel.findById(_id);
    if (!movie) {
      throw new NotFoundException('Movie not found !');
    }

    return new MovieDto(movie);
  }

  async bySlug(slug: string): Promise<MovieDto[]> {
    const movies: MovieModel[] = await this.movieModel.find({ slug }).populate('actors genres');
    this.isFoundMovies(movies);

    return movies.map((movie) => new MovieDto(movie));
  }

  async byGenreIds(genreIds: Types.ObjectId[]): Promise<MovieDto[]> {
    const movies: MovieModel[] = await this.movieModel.find({ genres: { $in: genreIds } }); // $in - find array with ObjectIds in 'genres' column array
    this.isFoundMovies(movies);

    return movies.map((movie) => new MovieDto(movie));
  }

  async byActorId(actorId: Types.ObjectId): Promise<MovieDto[]> {
    const movies: MovieModel[] = await this.movieModel.find({ actors: actorId });
    this.isFoundMovies(movies);

    return movies.map((movie) => new MovieDto(movie));
  }

  async updateCountOpened(slug: string): Promise<MovieDto> {
    // Here is finding movie by slug, and with '$inc' in findOneAndUpdate() - update 'countOpened' up to 1 point.
    const movieUpdated: MovieModel = await this.movieModel.findOneAndUpdate(
      { slug },
      {
        $inc: { countOpened: 1 },
      },
      {
        new: true,
      },
    );
    if (!movieUpdated) {
      throw new NotFoundException('Movie not found !');
    }

    return new MovieDto(movieUpdated);
  }

  async create(movieDTO: CreateMovieDto): Promise<MovieDto | void> {
    await this.isExist(movieDTO.slug);

    let movieVideo: FileResponse | undefined;
    if (movieDTO.movie) {
      movieVideo = await this.fileService.uploadSingleFile(movieDTO.movie, 'movies');
    }

    let moviePoster: FileResponse | undefined;
    if (movieDTO.poster) {
      moviePoster = await this.fileService.uploadSingleFile(movieDTO.poster, 'posters');
    }

    let movieWidePoster: FileResponse | undefined;
    if (movieDTO.widePoster) {
      movieWidePoster = await this.fileService.uploadSingleFile(movieDTO.widePoster, 'wide-posters');
    }

    const movie = new this.movieModel({
      poster: moviePoster.url,
      widePoster: movieWidePoster.url,
      title: movieDTO.title,
      description: movieDTO.description,
      slug: movieDTO.slug,
      movieUrl: movieVideo.url,
      parameters: {
        year: movieDTO.year,
        duration: movieDTO.duration,
        country: movieDTO.country,
      },
      genres: movieDTO.genres,
      actors: movieDTO.actors,
      isPublicToTelegram: movieDTO.isPublicToTelegram,
    });
    await movie.save();

    // TODO: create telegram notification

    return new MovieDto(movie);
  }

  async getMostPopular(): Promise<MovieDto[]> {
    // Here is finding all movies where countOpened greater than 0. Sorting this array from low popular to most popular
    const movies: MovieModel[] = await this.movieModel
      .find({ countOpened: { $gt: 0 } })
      .sort({
        countOpened: -1,
      })
      .populate('genres');
    this.isFoundMovies(movies);

    return movies.map((movie) => new MovieDto(movie));
  }

  async update(_id: Types.ObjectId, movieDTO: UpdateMovieDto): Promise<MovieDto> {
    // TODO: create telegram notification

    const movie = await this.movieModel.findById(_id);
    if (!movie) {
      throw new NotFoundException('Movie not found !');
    }

    let moviePoster: FileResponse | undefined;
    if (movieDTO.poster) {
      await this.fileService.deleteFile(movie.poster);
      moviePoster = await this.fileService.uploadSingleFile(movieDTO.poster, 'posters');
    }

    let movieWidePoster: FileResponse | undefined;
    if (movieDTO.widePoster) {
      await this.fileService.deleteFile(movie.widePoster);
      movieWidePoster = await this.fileService.uploadSingleFile(movieDTO.widePoster, 'wide-posters');
    }

    if (moviePoster) movie.poster = moviePoster.url;
    if (movieWidePoster) movie.widePoster = movieWidePoster.url;
    if (movieDTO.title) movie.title = movieDTO.title;
    if (movieDTO.description) movie.description = movieDTO.description;
    if (movieDTO.slug) movie.slug = movieDTO.slug;
    movie.parameters = {
      year: movieDTO.year ? movieDTO.year : movie.parameters.year,
      duration: movieDTO.duration ? movieDTO.duration : movie.parameters.duration,
      country: movieDTO.country ? movieDTO.country : movie.parameters.country,
    };
    if (movieDTO.genres) movie.genres = movieDTO.genres;
    if (movieDTO.actors) movie.actors = movieDTO.actors;
    if (movieDTO.isPublicToTelegram) movie.isPublicToTelegram = movieDTO.isPublicToTelegram;

    await movie.save();

    return new MovieDto(movie);
  }

  async updateMovieRating(_id: Types.ObjectId, newRating: number): Promise<MovieDto> {
    const movie = await this.movieModel.findByIdAndUpdate(
      _id,
      {
        rating: newRating,
      },
      { new: true },
    );

    return new MovieDto(movie);
  }

  async delete(_id: Types.ObjectId): Promise<MovieModel> {
    return await this.movieModel.findByIdAndDelete(_id);
  }
}
