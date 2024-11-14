import { ParticipationRequestRepositoryInterface } from '../../../domain/repositories/participant_request.repository.interface';
import { ParticipationRequestRepository } from '../../../infrastructure/repositories/participationRequest.repository';

export class RejectParticipationRequestUseCase {
    private participationRequestRepository: ParticipationRequestRepositoryInterface
  constructor() {
    this.participationRequestRepository = new ParticipationRequestRepository();
  }

  async execute(requestId: number) {
    return await this.participationRequestRepository.deleteOne(requestId);
  }
}
