import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Place } from './place';
import { Message } from './message';

@Entity()
export class Forum extends AbstractEntity {
  @ManyToOne(() => Place)
  @JoinColumn({ name: 'placeId' })
  place: Place;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Message, (message) => message.forum)
  @JoinColumn({ name: 'messagesId' })
  messages: Message[];
}