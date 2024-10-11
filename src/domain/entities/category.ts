import { Entity, Column, OneToMany, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../utils/abstract.entity';
import { Itinerary } from './itinerary';
import { Weather } from './weather';
import { User } from './user';

@Entity()
export class Category extends AbstractEntity {
  @Column()
  description: string;

  @Column('simple-array', { nullable: false })
  image: string;
}
