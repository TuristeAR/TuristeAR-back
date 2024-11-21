// entities/participation-request.entity.ts
import { Entity, ManyToOne, JoinColumn, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Itinerary } from './itinerary';
import { User } from './user';
import { Notification } from './notification';

@Entity()
export class ParticipationRequest extends AbstractEntity {
  @ManyToOne(() => Itinerary, (itinerary) => itinerary.participants)
  @JoinColumn({ name: 'itineraryId' })
  itinerary: Itinerary;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'participantId' })
  participant: User;

  @OneToMany(() => Notification, (notification) => notification.participationRequest)
  notifications: Notification[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;
  
  @Column({ default: 'pending' }) 
  status: 'pending' | 'accepted' | 'rejected';

  @Column()
  createdAt: Date;
}
