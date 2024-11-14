import { ParticipationRequest } from '../../../domain/entities/participationRequest';
import { ParticipationRequestRepositoryInterface } from '../../../domain/repositories/participant_request.repository.interface';
import { ItineraryRepositoryInterface } from '../../../domain/repositories/itinerary.repository.interface';
import { UserRepositoryInterface } from '../../../domain/repositories/user.repository.interface';
import { ParticipationRequestRepository } from '../../../infrastructure/repositories/participationRequest.repository';
import { ItineraryRepository } from '../../../infrastructure/repositories/itinerary.repository';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';

export class FindPendingParticipationRequestUseCase {
  private participationRequestRepository: ParticipationRequestRepositoryInterface;
  private itineraryRepository: ItineraryRepositoryInterface;
  private userRepository: UserRepositoryInterface;

  constructor() {
    this.participationRequestRepository = new ParticipationRequestRepository()
    this.itineraryRepository = new ItineraryRepository()
    this.userRepository = new UserRepository()
  }

  async execute(itineraryId: number, participantId: number): Promise<ParticipationRequest | null> {
    const itinerary = await this.itineraryRepository.findOne({ where: { id: itineraryId } });
    const participant = await this.userRepository.findOne({ where: { id: participantId } });

    if (!itinerary || !participant) {
      throw new Error('Itinerary or User not found');
    }

    return await this.participationRequestRepository.findOne({
      where: { itinerary: itinerary, participant: participant, status: 'pending' },
    });
  }
}
