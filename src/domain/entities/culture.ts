import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../utils/abstract.entity';
import { Province } from './province';
import { TypeOfCulture } from './typeOfCulture';

@Entity()
export class Culture extends AbstractEntity {
    @Column()
    title: string;

    @Column()
    images: string;

    @Column()
    description: string;

    @ManyToOne(() => Province, (province) => province.cultures) 
    @JoinColumn({ name: 'id_province' }) 
    province: Province;
    
    // Relación ManyToOne con TypeOfCulture
    @ManyToOne(() => TypeOfCulture, (typeOfCulture) => typeOfCulture.cultures) 
    @JoinColumn({ name: 'id_type' }) 
    typeOfCulture: TypeOfCulture;

}
