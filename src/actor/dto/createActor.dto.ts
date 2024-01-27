import { IsString, IsOptional } from 'class-validator';

export class CreateActorDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  slug: string;

  @IsOptional()
  image?: Express.Multer.File;
}
