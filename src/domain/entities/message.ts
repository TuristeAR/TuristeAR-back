import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../utils/abstract.entity';
import { Itinerary } from './itinerary';
import { Place } from './place';
import { Forum } from './forum';
import { User } from './user';

@Entity()
export class Message extends AbstractEntity {

  @Column()
  content: string;

  @Column()
  images: string[];

  @ManyToOne(() => User)
  @Column()
  user: User;

}
