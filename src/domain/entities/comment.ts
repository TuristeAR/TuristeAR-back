import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Publication } from './publication';
import { AbstractEntity } from './abstract.entity';
import { User } from './user';

@Entity()
export class Comment extends AbstractEntity{

  @Column()
  description: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Publication)
  @JoinColumn({ name: 'publicationId' })
  publication: Publication;
}