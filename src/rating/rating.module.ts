import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { TypegooseModule } from 'nestjs-typegoose';

import { RatingModel } from './rating.model';
import { MovieModule } from '../movie/movie.module';
import { MovieService } from '../movie/movie.service';
import { MovieModel } from '../movie/movie.model';
import { FileService } from '../file/file.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: RatingModel,
        schemaOptions: {
          collection: 'Rating',
        },
      },
    ]),
    MovieModule,
  ],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}
