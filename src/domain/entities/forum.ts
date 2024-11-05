import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Place } from './place';
import { Message } from './message';
import { Category } from './category';
import { Itinerary } from './itinerary';

@Entity()
export class Forum extends AbstractEntity {

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Message, (message) => message.forum)
  @JoinColumn({ name: 'messagesId' })
  messages: Message[];

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category | null;

  @Column()
  isPublic: boolean;
}
