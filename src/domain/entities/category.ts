import { Entity, Column, OneToMany, ManyToMany, ManyToOne, JoinColumn, JoinTable } from 'typeorm';
import { AbstractEntity } from '../../utils/abstract.entity';
import { Itinerary } from './itinerary';
import { Weather } from './weather';
import { User } from './user';
import { Province } from './province';

@Entity()
export class Category extends AbstractEntity {
  @Column()
  description: string;

  @Column()
  image: string;
}
