import { IsNumber, Min, Max } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';

export class SetRatingDto {
  @IsObjectId({ message: 'Invalid movie ID type !' })
  movieId: Types.ObjectId;

  @IsNumber()
  @Min(0, { message: 'Rating must be at least 0 !' })
  @Max(5, { message: 'Rating must be at most 5 !' })
  rating: number;
}
