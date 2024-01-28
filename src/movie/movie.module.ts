import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MovieModel } from './movie.model';
import { FileService } from '../file/file.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: MovieModel,
        schemaOptions: {
          collection: 'Movie',
        },
      },
    ]),
  ],
  controllers: [MovieController],
  providers: [MovieService, FileService],
})
export class MovieModule {}
