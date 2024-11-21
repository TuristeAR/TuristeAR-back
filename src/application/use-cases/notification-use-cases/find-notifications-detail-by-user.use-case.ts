import { NotificationRepositoryInterface } from '../../../domain/repositories/notification.repository.interface';
import { NotificationRepository } from '../../../infrastructure/repositories/notification.repository';
import { Notification } from '../../../domain/entities/notification';

export class FindNotificationsDetailByUserUseCase {
  private notificationRepository: NotificationRepositoryInterface;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  execute(userId: number): Promise<Notification[]> {
    return this.notificationRepository.findMany({
      where: { user : {id : userId}},
      relations: ['user', 'publication.likes','publication.reposts',
        'publication.comments.user','publication.saved', 'itinerary.user',
        'participationRequest', 'participationRequest.sender', 
        'participationRequest.sender', 'participationRequest.itinerary', 'comment'],
      order: { id: 'DESC' },
    });
  }
}
