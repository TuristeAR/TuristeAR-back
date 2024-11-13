// entities/participation-request.entity.ts
import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Itinerary } from './itinerary';
import { User } from './user';

@Entity()
export class ParticipationRequest extends AbstractEntity {
  @ManyToOne(() => Itinerary, (itinerary) => itinerary.participants)
  @JoinColumn({ name: 'itineraryId' })
  itinerary: Itinerary;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'participantId' })
  participant: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;
  
  @Column({ default: 'pending' }) 
  status: 'pending' | 'accepted' | 'rejected';

  @Column()
  createdAt: Date;
}
