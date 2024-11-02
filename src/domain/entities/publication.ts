import { Entity, Column, ManyToMany, ManyToOne, JoinColumn, JoinTable, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { User } from './user';
import { Category } from './category';
import { Comment } from './comment';
import { Activity } from './activity';

@Entity()
export class Publication extends AbstractEntity {
  @Column()
  description: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category | null;

  @ManyToMany(() => User)
  @JoinTable({
    joinColumn: { name: 'publicationId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  likes: User[];

  @ManyToMany(() => User)
  @JoinTable({
    joinColumn: { name: 'publicationId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  reposts: User[];

  @ManyToMany(() => User)
  @JoinTable({
    joinColumn: { name: 'publicationId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  saved: User[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => Activity)
  @JoinTable({
    joinColumn: { name: 'publicationId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'activityId', referencedColumnName: 'id' },
  })
  activities: Activity[];

  @OneToMany(()=> Comment, (comment) => comment.publication)
  comments: Comment[];
}
