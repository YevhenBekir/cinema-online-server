import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';

import { FileResponse } from './file.interface';

@Injectable()
export class FileService {
  async uploadFiles(files: Express.Multer.File[], folder: string = 'default'): Promise<FileResponse[]> {
    const uploadFolder: string = `${path}/uploads/${folder}`;

    await ensureDir(uploadFolder); // Check directory to exist. If not exist - create directory

    const result: FileResponse[] = await Promise.all(
      // Mapping files in Promise.all from await each of iteration
      files.map(async (file) => {
        await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer); // Writing file on file system

        return {
          url: `/uploads/${folder}/${file.originalname}`,
          name: file.originalname,
        };
      }),
    );

    return result;
  }
}
