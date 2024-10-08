import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { AbstractEntity } from '../../utils/abstract.entity';
import { Itinerary } from './itinerary';

@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  profilePicture: string;

  @Column()
  description : string;

  @Column()
  coverPicture : string;

  @Column()
  location : string;

  @Column()
  birthdate : Date;

  @Column({ unique: true })
  googleId: string;

  @OneToMany(() => Itinerary, (itinerary) => itinerary.user)
  ownedItineraries: Itinerary[];

  @ManyToMany(() => Itinerary, (itinerary) => itinerary.participants)
  joinedItineraries: Itinerary[]; 
}
