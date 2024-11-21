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
import { Expense } from './expense';
import { Notification } from './notification';
import { ParticipationRequest } from './participationRequest';

@Entity()
export class Itinerary extends AbstractEntity {
  @OneToMany(() => Activity, (activity) => activity.itinerary)
  activities: Activity[];

  @OneToMany(() => Event, (event) => event.itinerary)
  events: Event[];

  @OneToMany(() => Expense, (expense) => expense.itinerary)
  expenses: Expense[];

  @OneToMany(() => Notification, (notification) => notification.itinerary)
  notifications: Notification[];

  @OneToMany(() => ParticipationRequest, (participationRequest) => participationRequest.itinerary)
  participationRequests: ParticipationRequest[];

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
  forum: Forum | null;
}
