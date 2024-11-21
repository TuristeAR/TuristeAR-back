import { ArrayNotEmpty, IsArray, IsDate, IsNumber, IsString } from 'class-validator';

interface Province {
  id: number;
  name: string;
  georefId: string;
}

export interface Locality {
  name: string;
  province: {
    id: string;
    nombre: string;
  };
}

export class CreateItineraryDto {
  @IsArray()
  @ArrayNotEmpty()
  provinces: Province[];

  @IsArray()
  @IsString({ each: true })
  localities: Locality[];

  @IsArray()
  @IsNumber({}, { each: true })
  events: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  expenses: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  notifications: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  participationRequests: number[];

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
