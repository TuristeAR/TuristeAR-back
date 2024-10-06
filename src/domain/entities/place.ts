import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../../utils/abstract.entity';

@Entity()
export class Place extends AbstractEntity {
  @Column({ nullable: false })
  provinceId: number;

  @Column({ unique: true })
  googleId: string;

  @Column({ nullable: false })
  name: string;

  @Column('simple-array', { nullable: true })
  types: string[];

  @Column({ nullable: false })
  address: string;

  @Column('float', { nullable: false })
  latitude: number;

  @Column('float', { nullable: false })
  longitude: number;

  @Column('float', { nullable: true })
  rating: number;

  @Column('simple-array', { nullable: true })
  openingHours: string[];

  @Column({ nullable: true })
  phoneNumber: string;
}
