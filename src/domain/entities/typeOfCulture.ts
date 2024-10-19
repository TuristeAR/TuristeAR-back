import { Column, Entity, OneToMany } from 'typeorm';
import { Culture } from './culture';
import { AbstractEntity } from '../../infrastructure/entities/abstract.entity';

@Entity()
export class TypeOfCulture extends AbstractEntity {
  @Column()
  type: string;

  @OneToMany(() => Culture, (culture) => culture.typeOfCulture) // Un tipo de cultura puede tener muchas culturas
  cultures: Culture[];
}
