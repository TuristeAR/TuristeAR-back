import { Itinerary } from '../../domain/entities/itinerary';
import { Place } from '../../domain/entities/place';

export class CreateActivityDto {
  itinerary: Itinerary;
  place: Place;
  fromDate: Date;
  toDate: Date;
}
