import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class Type extends AbstractEntity {
  @Column({ nullable: false })
  description: string;

  @Column('simple-array', { nullable: true })
  data: string[];
}
