import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../../infrastructure/entities/abstract.entity';

@Entity()
export class Category extends AbstractEntity {
  @Column()
  description: string;

  @Column()
  image: string;
}
