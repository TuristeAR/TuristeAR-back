import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Weather } from './weather';
import { Place } from './place';

@Entity()
export class Province extends AbstractEntity {
  @Column({ unique: true, nullable: false })
  georefId: string;

  @ManyToOne(() => Weather)
  @JoinColumn({ name: 'weatherId' })
  weather: Weather;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column('simple-array', { nullable: false })
  images: string[];

  @OneToMany(() => Place, (place) => place.province)
  places: Place[];
}
