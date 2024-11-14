import { ParticipationRequest } from '../../../domain/entities/participationRequest';
import { ParticipationRequestRepositoryInterface } from '../../../domain/repositories/participant_request.repository.interface';
import { ItineraryRepositoryInterface } from '../../../domain/repositories/itinerary.repository.interface';
import { UserRepositoryInterface } from '../../../domain/repositories/user.repository.interface';
import { ParticipationRequestRepository } from '../../../infrastructure/repositories/participationRequest.repository';
import { ItineraryRepository } from '../../../infrastructure/repositories/itinerary.repository';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';

export class FindOneParticipationRequestByIdUseCase {
  private participationRequestRepository: ParticipationRequestRepositoryInterface;


  constructor() {
    this.participationRequestRepository = new ParticipationRequestRepository()
  }

  async execute(id: number): Promise<ParticipationRequest | null> {
    return await this.participationRequestRepository.findOne({
      where: { id: id },
      relations: ['itinerary', 'participant', 'sender']
    });
  }
}
