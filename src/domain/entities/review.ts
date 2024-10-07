import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../utils/abstract.entity';
import { Place } from './place';

@Entity()
export class Review extends AbstractEntity {
  @ManyToOne(() => Place, (place) => place.reviews)
  @JoinColumn({ name: 'googleId', referencedColumnName: 'googleId' })
  place: Place;

  @Column()
  publishedTime: string;

  @Column()
  rating: number;

  @Column()
  text: string;

  @Column()
  authorName: string;

  @Column()
  authorPhoto: string;

  @Column('simple-json')
  photos: string[];
}
