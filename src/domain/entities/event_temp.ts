import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Province } from './province';
import { User } from './user';

@Entity()
export class EventTemp extends AbstractEntity {
    @Column()
    fromDate: Date;

    @Column()
    toDate: Date;

    @Column()
    name: string;

    @ManyToOne(() => Province, (province) => province.places)
    @JoinColumn({ name: 'provinceId' })
    province: Province;

    @Column()
    locality: string;

    @Column()
    description: string;

    @Column('float')
    latitude: number;

    @Column('float')
    longitude: number;

    @Column()
    image: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User | null;

    @Column({ default: 0 })
    cont: number;
}
