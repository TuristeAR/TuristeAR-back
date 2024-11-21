import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Province } from './province';
import { Itinerary } from './itinerary';

@Entity()
export class Event extends AbstractEntity {
  @Column()
  fromDate: Date;

  @Column()
  toDate: Date;

  @Column()
  name: string;

  @ManyToOne(() => Province, (province) => province.places)
  @JoinColumn({ name: 'provinceId' })
  province: Province;

  @Column()
  locality: string;

  @Column()
  description: string;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column()
  image: string;

  @ManyToOne(() => Itinerary, (itinerary) => itinerary.events)
  @JoinColumn({ name: 'itineraryId' })
  itinerary: Itinerary | null;
}
