import { FindItineraryByIdUseCase } from '../../application/use-cases/itinerary-use-cases/find-itinerary-by-id.use-case';
import { FindUserByIdUseCase } from '../../application/use-cases/user-use-cases/find-user-by.id.use-case';
import { FindPendingParticipationRequestUseCase } from '../../application/use-cases/participation-request-use-cases/find-pending-participation-request.use-case';
import { RejectParticipationRequestUseCase } from '../../application/use-cases/participation-request-use-cases/reject-participation-request.use-case';
import { ParticipationRequest } from '../entities/participationRequest';
import { Notification } from '../entities/notification';
import { SaveParticipationRequestUseCase } from '../../application/use-cases/participation-request-use-cases/save-participation-request.use-case';
import { AcceptParticipationRequestUseCase } from '../../application/use-cases/participation-request-use-cases/accept-participation-request.use-case';
import { CreateNotificationUseCase } from '../../application/use-cases/notification-use-cases/create-notification.use-case';
import { FindAllParticipationRequestsByParticipantIdUseCase } from '../../application/use-cases/participation-request-use-cases/find-all-participation-requests-by-participant-id.use-case';
import { User } from '../entities/user';
import { FindOneParticipationRequestByIdUseCase } from '../../application/use-cases/participation-request-use-cases/find-one-particiaption-request-by-id.use-case';

export class ParticipationRequestService {

  private findItineraryByIdUseCase: FindItineraryByIdUseCase;
  private findUserByIdUseCase: FindUserByIdUseCase;
  private findPendingParticipationRequestUseCase: FindPendingParticipationRequestUseCase;
  private saveParticipationRequestUseCase: SaveParticipationRequestUseCase;
  private acceptParticipationRequestUseCase: AcceptParticipationRequestUseCase;
  private rejectParticipationRequestUseCase: RejectParticipationRequestUseCase;
  private findAllParticipationRequestsByParticipantIdUseCase: FindAllParticipationRequestsByParticipantIdUseCase;
  private findOneParticipationRequestsByParticipantIdUseCase: FindOneParticipationRequestByIdUseCase;

  constructor() {
    this.findItineraryByIdUseCase = new FindItineraryByIdUseCase();
    this.findUserByIdUseCase = new FindUserByIdUseCase();
    this.findPendingParticipationRequestUseCase = new FindPendingParticipationRequestUseCase();
    this.saveParticipationRequestUseCase = new SaveParticipationRequestUseCase();
    this.acceptParticipationRequestUseCase = new AcceptParticipationRequestUseCase();
    this.rejectParticipationRequestUseCase = new RejectParticipationRequestUseCase();
    this.findAllParticipationRequestsByParticipantIdUseCase = new FindAllParticipationRequestsByParticipantIdUseCase();
    this.findOneParticipationRequestsByParticipantIdUseCase = new FindOneParticipationRequestByIdUseCase();
  }

  async sendParticipationRequest(itineraryId: number, participantId: number, sender: User) {
    const itinerary = await this.findItineraryByIdUseCase.execute(itineraryId);
    const participant = await this.findUserByIdUseCase.execute(participantId);

    if (!itinerary || !participant) {
      throw new Error('Itinerary or User not found');
    }
    const existingRequest = await this.findPendingParticipationRequestUseCase.execute(
      itineraryId,
      participantId,
    );

    if (existingRequest) {
      throw new Error('Participation request already sent');
    }

    const newRequest = new ParticipationRequest();
    newRequest.itinerary = itinerary;
    newRequest.participant = participant;
    newRequest.status = 'pending';
    newRequest.sender = sender;

    const save = await this.saveParticipationRequestUseCase.execute(newRequest);
    const createNotificationUseCase = new CreateNotificationUseCase();
      const notification = new Notification();
      notification.participationRequest = newRequest;
      notification.user = participant;
      notification.description = itinerary.user.name + ' te invitó a su viaje!';
      notification.publication = null;
      notification.isRead = false;

      await createNotificationUseCase.execute(notification);
    return save;
  }

  async acceptParticipationRequest(requestId: number) {
    return await this.acceptParticipationRequestUseCase.execute(requestId);
  }

  async rejectParticipationRequest(requestId: number) {
    return await this.rejectParticipationRequestUseCase.execute(requestId);
  }

  async getParticipationRequestsByParticipant(participantId: number) {
    return await this.findAllParticipationRequestsByParticipantIdUseCase.execute(participantId);
  }
  async getOneParticipationRequestsByParticipantIdUseCase(participationRequestId: number) {
    return await this.findOneParticipationRequestsByParticipantIdUseCase.execute(
      participationRequestId,
    );  
  }
}
