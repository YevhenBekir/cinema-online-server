import { Injectable, NotFoundException } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as fs from 'fs/promises';

import { FileResponse } from './file.interface';

@Injectable()
export class FileService {
  async uploadFiles(files: Express.Multer.File[], folder: string = 'default'): Promise<FileResponse[]> {
    const uploadFolder: string = `${path}/uploads/${folder}`;

    await ensureDir(uploadFolder); // Check directory to existing. If not exist - create directory

    const result: FileResponse[] = await Promise.all(
      // Mapping files in Promise.all from await each of iteration
      files.map(async (file) => {
        await writeFile(`${uploadFolder}/${file.originalname.replace(/\s/g, '_')}`, file.buffer); // Writing file on file system

        return {
          url: `/uploads/${folder}/${file.originalname.replace(/\s/g, '_')}`,
          name: file.originalname,
        };
      }),
    );

    return result;
  }

  async uploadSingleFile(file: Express.Multer.File, folder: string = 'default'): Promise<FileResponse> {
    const uploadFolder: string = `${path}/uploads/${folder}`;

    await ensureDir(uploadFolder);
    await writeFile(`${uploadFolder}/${file.originalname.replace(/\s/g, '_')}`, file.buffer);

    return {
      url: `/uploads/${folder}/${file.originalname.replace(/\s/g, '_')}`,
      name: file.originalname,
    };
  }

  async deleteFile(filePath: string): Promise<void> {
    if (filePath) {
      try {
        const fullPath = `${path}${filePath}`;

        const fileExists = await fs
          .access(fullPath)
          .then(() => true)
          .catch(() => false);

        if (fileExists) {
          return await fs.unlink(fullPath);
        } else {
          console.log(`File ${fullPath} does not exist.`);
        }
      } catch (error) {
        throw error;
      }
    } else {
      throw new NotFoundException("No 'filepath' parameter passed !");
    }
  }
}
