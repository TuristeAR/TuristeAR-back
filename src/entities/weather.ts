import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../utils/abstract.entity';

@Entity()
export class Weather extends AbstractEntity {
  @Column({ nullable: false })
  name: string;
}
