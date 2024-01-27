import { IsString } from 'class-validator';

export class FileResponse {
  @IsString()
  url: string;

  @IsString()
  name: string;
}
