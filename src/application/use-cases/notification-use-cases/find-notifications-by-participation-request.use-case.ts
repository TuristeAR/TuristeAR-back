import { NotificationRepositoryInterface } from '../../../domain/repositories/notification.repository.interface';
import { NotificationRepository } from '../../../infrastructure/repositories/notification.repository';
import { Notification } from '../../../domain/entities/notification';

export class FindNotificationsByParticipationRequestUseCase {
  private notificationRepository: NotificationRepositoryInterface;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  execute(id: number): Promise<Notification[]> {
    return this.notificationRepository.findMany({where: { participationRequest : {id : id}}});
  }
}
