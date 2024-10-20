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

  @Column('simple-array', { nullable: false })
  images: string[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Forum, (forum) => forum.messages)  // Relación ManyToOne con Forum
  @JoinColumn({ name: 'forumId' })
  forum: Forum;

}
