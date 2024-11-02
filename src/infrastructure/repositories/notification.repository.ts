import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { Notification } from '../../domain/entities/notification';
import { NotificationRepositoryInterface } from '../../domain/repositories/notification.repository.interface';

export class NotificationRepository
    extends AbstractRepository<Notification>
    implements NotificationRepositoryInterface
{
    constructor() {
        super(AppDataSource.getRepository(Notification));
    }
}