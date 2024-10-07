import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';

export class CreateItineraryDto {
  @IsNumber()
  provinceId: number;

  @IsArray()
  @IsString({ each: true })
  types: string[];

  @IsNumber()
  weather: number;

  @IsDate()
  fromDate: Date;

  @IsDate()
  toDate: Date;
}
