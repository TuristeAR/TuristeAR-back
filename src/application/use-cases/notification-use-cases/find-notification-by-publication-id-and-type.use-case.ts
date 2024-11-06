import { NotificationRepositoryInterface } from '../../../domain/repositories/notification.repository.interface';
import { NotificationRepository } from '../../../infrastructure/repositories/notification.repository';
import { Notification } from '../../../domain/entities/notification';
import { Like } from 'typeorm';

export class FindNotificationByPublicationIdAndTypeUseCase {
  private notificationRepository: NotificationRepositoryInterface;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  async execute(publicationId: number, type: string): Promise<Notification | null> {
    return this.notificationRepository.findOne({
      where: {
        publication: { id: publicationId },
        description: Like(`%${type}%`),
      },
    });
  }

}
