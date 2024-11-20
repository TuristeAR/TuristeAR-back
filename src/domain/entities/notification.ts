import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { User } from './user';
import { Publication } from './publication';
import { Itinerary } from './itinerary';
import { ParticipationRequest } from './participationRequest';
import { Comment } from './comment';

@Entity()
export class Notification extends AbstractEntity {
    @Column()
    description: string;

    @Column()
    isRead: boolean;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User | null;

    @ManyToOne(() => Publication)
    @JoinColumn({ name: 'publicationId' })
    publication: Publication | null;

    @ManyToOne(() => Itinerary)
    @JoinColumn({ name: 'itineraryId' })
    itinerary: Itinerary | null;

    @ManyToOne(() => Comment)
    @JoinColumn({ name: 'commentId' })
    comment: Comment | null;

    @ManyToOne(() => ParticipationRequest)
    @JoinColumn({ name: 'participationRequestId' })
    participationRequest: ParticipationRequest | null;
}