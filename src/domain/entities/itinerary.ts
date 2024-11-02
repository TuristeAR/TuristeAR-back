import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Activity } from './activity';
import { Event } from './event';
import { User } from './user';
import { Forum } from './forum';

@Entity()
export class Itinerary extends AbstractEntity {
  @OneToMany(() => Activity, (activity) => activity.itinerary)
  activities: Activity[];

  @OneToMany(() => Event, (event) => event.itinerary)
  events: Event[];

  @Column()
  name: string;

  @Column()
  fromDate: Date;

  @Column()
  toDate: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => User)
  @JoinTable({
    joinColumn: { name: 'itineraryId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  participants: User[];

  @OneToOne(() => Forum)
  @JoinColumn({ name: 'forumId' })
  forum: Forum;
}
