import { NotificationRepositoryInterface } from '../../../domain/repositories/notification.repository.interface';
import { NotificationRepository } from '../../../infrastructure/repositories/notification.repository';
import { Notification } from '../../../domain/entities/notification';

export class CreateNotificationUseCase {
  private notificationRepository: NotificationRepositoryInterface;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  execute(notification: Notification): Promise<Notification> {
    return this.notificationRepository.create(notification);
  }
}
