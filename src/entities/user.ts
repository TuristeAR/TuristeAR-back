import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../utils/abstract.entity';

@Entity()
export class User extends AbstractEntity {
  @Column()
  name!: string;
}
