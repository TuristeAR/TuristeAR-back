import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';


export class CreatePublicationDTO {
  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsString()
  creationDate: string;

  @IsOptional()
  @IsArray()
  @IsNumber()
  likes?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber()
  reposts?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber()
  saved?: number[];

  @IsNumber()
  categoryId : number;

  @IsNumber()
  userId: number;

  @IsNumber()
  itineraryId: number;
}