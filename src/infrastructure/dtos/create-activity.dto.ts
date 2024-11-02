import { Itinerary } from '../../domain/entities/itinerary';
import { Place } from '../../domain/entities/place';
import { IsArray, IsString } from 'class-validator';

export class CreateActivityDto {
  itinerary: Itinerary;
  place: Place;
  name: string;
  fromDate: Date;
  toDate: Date;
  @IsArray()
  @IsString({ each: true })
  images: string[];
}
