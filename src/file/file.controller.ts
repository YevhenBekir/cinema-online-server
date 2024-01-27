import { Controller, HttpCode, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FileService } from './file.service';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file')) // Use interceptor for get 'file' from http request
  @HttpCode(200)
  @Auth('admin')
  async uploadFiles(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
    return await this.fileService.uploadFiles([file], folder);
  }
}
