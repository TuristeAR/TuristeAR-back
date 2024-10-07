import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../utils/abstract.entity';
import { Itinerary } from './itinerary';

@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  profilePicture: string;

  @Column({ unique: true })
  googleId: string;

  @OneToMany(() => Itinerary, (itinerary) => itinerary.user)
  itineraries: Itinerary[];
}
