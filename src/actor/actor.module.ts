import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '@nestjs/config';

import { ActorController } from './actor.controller';
import { ActorService } from './actor.service';
import { ActorModel } from './actor.model';
import { FileService } from 'src/file/file.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ActorModel,
        schemaOptions: {
          collection: 'Actor',
        },
      },
    ]),
  ],
  controllers: [ActorController],
  providers: [ActorService, FileService],
})
export class ActorModule {}
