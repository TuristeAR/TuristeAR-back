import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';

export class CreateItineraryDto {
  @IsNumber()
  provinceId: number;

  @IsArray()
  @IsString({ each: true })
  localities: string[];

  @IsDate()
  fromDate: Date;

  @IsDate()
  toDate: Date;

  @IsArray()
  @IsString({ each: true })
  priceLevel: string[];

  @IsArray()
  @IsString({ each: true })
  types: string[];

  @IsNumber()
  company: number;

  @IsNumber()
  forum: number;
}
