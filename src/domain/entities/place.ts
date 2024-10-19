import { Entity, Column, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../utils/abstract.entity';
import { Province } from './province';
import { Review } from './review';
import { Activity } from './activity';

@Entity()
export class Place extends AbstractEntity {

  @ManyToOne(() => Province, (province) => province.places)
  @JoinColumn({ name: 'provinceId' })
  province: Province;

  @Column({ unique: true })
  googleId: string;

  @OneToMany(() => Review, (review) => review.place)
  reviews: Review[];

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

  @OneToMany(() => Activity, (activity) => activity.place)
  activities: Activity[];
}
