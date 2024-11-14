import { ParticipationRequest } from '../../../domain/entities/participationRequest';
import { ParticipationRequestRepositoryInterface } from '../../../domain/repositories/participant_request.repository.interface';
import { ParticipationRequestRepository } from '../../../infrastructure/repositories/participationRequest.repository';

export class SaveParticipationRequestUseCase {
    private participationRequestRepository: ParticipationRequestRepositoryInterface
    constructor() {
        this.participationRequestRepository = new ParticipationRequestRepository()
    }

  async execute(participationRequest: ParticipationRequest): Promise<ParticipationRequest> {
    console.log(participationRequest)
    return await this.participationRequestRepository.save(participationRequest);
  }
}
