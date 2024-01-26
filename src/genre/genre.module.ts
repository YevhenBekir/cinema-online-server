import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';

import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { GenreModel } from './genre.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: GenreModel,
        schemaOptions: {
          collection: 'Genre',
        },
      },
    ]),
    ConfigModule,
  ],
  controllers: [GenreController],
  providers: [GenreService],
})
export class GenreModule {}
