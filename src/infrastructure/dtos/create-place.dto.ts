import { IsInstance, IsNumber, IsString } from 'class-validator';
import { Province } from '../../domain/entities/province';

export class CreatePlaceDto {
  @IsInstance(Province)
  province: Province;

  @IsString()
  googleId: string;

  @IsString()
  name: string;

  @IsString({ each: true })
  types: string[];

  @IsString()
  address: string;

  @IsString()
  locality: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  rating: number;

  @IsString({ each: true })
  openingHours: string[];

  @IsString()
  priceLevel: string;

  @IsString()
  phoneNumber: string;
}
