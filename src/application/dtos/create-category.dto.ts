import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsArray()
  @IsNumber()
  provinces : number;
}
