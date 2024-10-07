import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../utils/abstract.entity';
import { Activity } from './activity';
import { User } from './user';

@Entity()
export class Itinerary extends AbstractEntity {
  @OneToMany(() => Activity, (activity) => activity.itinerary)
  activities: Activity[];

  @Column()
  fromDate: Date;

  @Column()
  toDate: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
