import { Entity, Column, OneToMany, ManyToMany, ManyToOne, JoinColumn, JoinTable } from 'typeorm';
import { AbstractEntity } from '../../utils/abstract.entity';
import { Itinerary } from './itinerary';
import { Weather } from './weather';
import { User } from './user';
import { Category } from './category';

@Entity()
export class Publication extends AbstractEntity {
  @Column()
  description: string;

  @Column('simple-array', { nullable: false })
  images: string[];

  @Column()
  creationDate: Date;

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
}
