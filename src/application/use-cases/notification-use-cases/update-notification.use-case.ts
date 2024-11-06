import { ItineraryRepositoryInterface } from '../../../domain/repositories/itinerary.repository.interface';
import { Itinerary } from '../../../domain/entities/itinerary';
import { ItineraryRepository } from '../../../infrastructure/repositories/itinerary.repository';
import { NotificationRepositoryInterface } from '../../../domain/repositories/notification.repository.interface';
import { NotificationRepository } from '../../../infrastructure/repositories/notification.repository';
import { Notification } from '../../../domain/entities/notification';

export class UpdateNotificationUseCase {
  private notificationRepository: NotificationRepositoryInterface;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  execute(notification: Notification): Promise<Notification> {
    return this.notificationRepository.save(notification);
  }
}
