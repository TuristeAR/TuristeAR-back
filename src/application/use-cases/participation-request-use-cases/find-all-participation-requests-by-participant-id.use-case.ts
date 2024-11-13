import { ParticipationRequest } from '../../../domain/entities/participationRequest';
import { ParticipationRequestRepository } from '../../../infrastructure/repositories/participationRequest.repository';
import { ParticipationRequestRepositoryInterface } from '../../../domain/repositories/participant_request.repository.interface';
import { Equal } from 'typeorm';

export class FindAllParticipationRequestsByParticipantIdUseCase {
  private participationRequestRepository: ParticipationRequestRepositoryInterface;

  constructor() {
    this.participationRequestRepository = new ParticipationRequestRepository();
  }

  async execute(participantId: Number): Promise<ParticipationRequest[]> {
    try {
      const participationRequests = await this.participationRequestRepository.findMany({
        where: {
          participant: Equal(participantId),

        },
        relations: ['itinerary', 'participant', 'sender'],

      });

      return participationRequests;
    } catch (error) {
      throw new Error(`Error fetching participation requests: ${error instanceof Error ? error.message:"Error"}`);
    }  }
}
