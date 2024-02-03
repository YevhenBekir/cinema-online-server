import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';

import { getDatabaseConfig } from '../common/config/db.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { GenreModule } from '../genre/genre.module';
import { FileModule } from '../file/file.module';
import { ActorModule } from '../actor/actor.module';
import { MovieModule } from '../movie/movie.module';
import { RatingModule } from '../rating/rating.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Setup and using .env file
    TypegooseModule.forRootAsync({
      // Setup connection with MongoDB using Typegoose
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    AuthModule,
    UserModule,
    GenreModule,
    FileModule,
    ActorModule,
    MovieModule,
    RatingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
