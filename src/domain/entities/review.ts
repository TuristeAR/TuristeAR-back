import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../../utils/abstract.entity';

@Entity()
export class Review extends AbstractEntity {
  @Column()
  googleId: string;

  @Column()
  publishedTime: string;

  @Column()
  rating: number;

  @Column()
  text: string;

  @Column()
  authorName: string;

  @Column()
  authorPhoto: string;

  @Column('simple-json')
  photos: string[];
}
