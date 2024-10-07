import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../utils/abstract.entity';
import { Activity } from './activity';
import { User } from './user';

@Entity()
export class Itinerary extends AbstractEntity {
  @OneToMany(() => Activity, (activity) => activity.itinerary)
  activities: Activity[];

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
}
