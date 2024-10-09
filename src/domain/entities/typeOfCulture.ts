import { Column, Entity, OneToMany } from 'typeorm';
import { Culture } from './culture';
import { AbstractEntity } from '../../utils/abstract.entity';


@Entity()
export class TypeOfCulture extends AbstractEntity {
    @Column()
    type: string;


    @OneToMany(() => Culture, (culture) => culture.typeOfCulture) // Un tipo de cultura puede tener muchas culturas
    cultures: Culture[];

}
