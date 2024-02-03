import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';

import { RatingModel } from './rating.model';
import { SetRatingDto } from './dto/setRating.dto';
import { MovieService } from 'src/movie/movie.service';
import { RatingDto } from './dto/rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(RatingModel) private readonly ratingModel: ModelType<RatingModel>,
    private readonly movieService: MovieService,
  ) {}

  async getRating(): Promise<RatingDto[]> {
    const totalRating: RatingModel[] = await this.ratingModel.find();
    if (!totalRating.length) {
      throw new NotFoundException('No movie is rated !');
    }

    return totalRating.map((rating) => new RatingDto(rating));
  }

  async getMovieToUserRating(userId: Types.ObjectId, movieId: Types.ObjectId): Promise<number> {
    return await this.ratingModel
      .findOne({ movie: movieId, user: userId }) // Find movie-to-user rating
      .select('rating') // Get only rating value
      .then((data) => (data ? data.rating : 0)); // Return only rating value or 0
  }

  async calculateAverageMovieByUsersRating(movieId: Types.ObjectId | string): Promise<number> {
    // Getting aggregated rates by all users to movie using movieId
    const ratingsMovie: RatingModel[] = await this.ratingModel.aggregate().match({
      movie: new Types.ObjectId(movieId),
    });

    // Returning average movie rating
    return (
      ratingsMovie.reduce((accumulator, userRating) => accumulator + userRating.rating, 0) /
      ratingsMovie.length
    );
  }

  async update(userId: Types.ObjectId, dto: SetRatingDto): Promise<RatingDto> {
    const rating: RatingModel = await this.ratingModel.findOneAndUpdate(
      { movie: dto.movieId, user: userId },
      {
        // Options for update or create (if not exist) next fields
        movie: dto.movieId,
        rating: dto.rating,
        user: userId,
      },
      {
        new: true, // Return (save) new element if not exist
        upsert: true, // Short name from 'update' and 'insert'. Create new element if not exist
        setDefaultsOnInsert: true, // If created new element. It will accept options from the second parameter (Options parameter)
      },
    );

    // Recalculate movie rating and update in movie document
    const newAverageMovieRating = await this.calculateAverageMovieByUsersRating(dto.movieId);
    await this.movieService.updateMovieRating(dto.movieId, newAverageMovieRating);

    return new RatingDto(rating);
  }
}
