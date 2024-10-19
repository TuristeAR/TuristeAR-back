import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../infrastructure/entities/abstract.entity';
import { Province } from './province';

@Entity()
export class Weather extends AbstractEntity {
  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Province, (province) => province.weather)
  province: Province;
}
