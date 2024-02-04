import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MovieModel } from './movie.model';
import { FileService } from '../file/file.service';
import { FileModule } from 'src/file/file.module';
import { TelegramModule } from 'src/telegram/telegram.module';

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
    TelegramModule,
  ],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService], // Giving access to MovieService from foreign Module
})
export class MovieModule {}
