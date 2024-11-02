import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { User } from './user';

@Entity()
export class Notification extends AbstractEntity {
    @Column()
    description: string;

    @Column('simple-array', { nullable: false })
    images: string[];

    @Column()
    isRead: boolean;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User | null;

}