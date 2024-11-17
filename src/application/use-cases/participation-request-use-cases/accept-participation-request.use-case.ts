import { ParticipationRequestRepositoryInterface } from "../../../domain/repositories/participant_request.repository.interface";
import { ParticipationRequestRepository } from "../../../infrastructure/repositories/participationRequest.repository";

export class AcceptParticipationRequestUseCase {
    private participationRequestRepository: ParticipationRequestRepositoryInterface
    constructor() {
        this.participationRequestRepository = new  ParticipationRequestRepository();
    }

  async execute(requestId: number) {
    const request = await this.participationRequestRepository.findOne({ where: { id: requestId } });

    if (!request || request.status !== 'pending') {
      throw new Error('Request not found or already handled');
    }

    request.status = 'accepted';
    return await this.participationRequestRepository.save(request);  }
}
