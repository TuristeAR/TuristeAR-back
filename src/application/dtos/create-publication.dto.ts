import { IsArray, IsNumber, IsString } from 'class-validator';


export class CreatePublicationDTO {
  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsString()
  creationDate: string;

  @IsArray()
  @IsNumber()
  likes: number;

  @IsArray()
  @IsNumber()
  reposts: number;

  @IsArray()
  @IsNumber()
  saved: number;

  @IsNumber()
  categoryId : number;

  @IsNumber()
  userId: number;
}