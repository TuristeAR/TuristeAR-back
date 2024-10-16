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
  @IsString({each: true})
  likes?: number[];

  @IsOptional()
  @IsArray()
  @IsString({each: true})
  reposts?: number[];

  @IsOptional()
  @IsArray()
  @IsString({each: true})
  saved?: number[];

  @IsNumber()
  categoryId : number;

  @IsNumber()
  userId: number;
}