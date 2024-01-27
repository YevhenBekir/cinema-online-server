import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';

import { FileService } from './file.service';
import { FileController } from './file.controller';

@Module({
  imports: [
    //This module serves action with static files
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`, // Path to static files
      serveRoot: '/uploads', // URL start point thanks to which i can take static files in server. For example - https://some-domain.com/uploads/...
    }),
  ],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
