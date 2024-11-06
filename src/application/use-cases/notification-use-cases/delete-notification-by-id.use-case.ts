import { PublicationRepositoryInterface } from '../../../domain/repositories/publication.repository.interface';
import { Publication } from '../../../domain/entities/publication';
import { PublicationRepository } from '../../../infrastructure/repositories/publication.repository';
import { DeleteResult } from 'typeorm';
import { ItineraryRepositoryInterface } from '../../../domain/repositories/itinerary.repository.interface';
import { ItineraryRepository } from '../../../infrastructure/repositories/itinerary.repository';
import { Itinerary } from '../../../domain/entities/itinerary';
import { NotificationRepositoryInterface } from '../../../domain/repositories/notification.repository.interface';
import { NotificationRepository } from '../../../infrastructure/repositories/notification.repository';

export class DeleteNotificationByIdUseCase {
  private notificationRepository: NotificationRepositoryInterface;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  execute(notificationId: number): Promise<DeleteResult> {
    return this.notificationRepository.deleteOne(notificationId);
  }
}
