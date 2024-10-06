import { IsNumber, IsString } from 'class-validator';

export class CreatePlaceDto {
  @IsNumber()
  provinceId: number;

  @IsString()
  googleId: string;

  @IsString()
  name: string;

  @IsString({ each: true })
  types: string[];

  @IsString()
  address: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  rating: number;

  @IsString({ each: true })
  openingHours: string[];

  @IsString()
  phoneNumber: string;
}
