import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
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
  user: User | null;

  @ManyToOne(() => Forum, (forum) => forum.messages)
  @JoinColumn({ name: 'forumId' })
  forum: Forum | null;
}
