import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProvinceDto {
  @IsString()
  georefId: string;

  @IsNumber()
  weatherId: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString({ each: true })
  @IsArray()
  images: string[];

  @IsNumber()
  categoryId : number;
}
