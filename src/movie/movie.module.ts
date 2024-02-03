import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MovieModel } from './movie.model';
import { FileService } from '../file/file.service';
import { FileModule } from 'src/file/file.module';

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
    FileModule,
  ],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService], // Giving access to MovieService from foreign Module
})
export class MovieModule {}
