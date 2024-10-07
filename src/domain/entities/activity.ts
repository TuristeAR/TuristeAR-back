import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../utils/abstract.entity';
import { Itinerary } from './itinerary';
import { Place } from './place';

@Entity()
export class Activity extends AbstractEntity {
  @ManyToOne(() => Itinerary, (itinerary) => itinerary.activities)
  @JoinColumn({ name: 'itineraryId' })
  itinerary: Itinerary;

  @ManyToOne(() => Place, (place) => place.activities)
  @JoinColumn({ name: 'placeId' })
  place: Place;

  @Column()
  fromDate: Date;

  @Column()
  toDate: Date;
}
