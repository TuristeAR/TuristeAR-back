import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../utils/abstract.entity';

@Entity()
export class Province extends AbstractEntity {
  @Column({ unique: true, nullable: false })
  georefId: string;

  @Column({ nullable: false })
  weatherId: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column('simple-array', { nullable: false })
  images: string[];
}
