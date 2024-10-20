import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { Message } from '../../domain/entities/message';
import { MessageRepositoryInterface } from '../../domain/repositories/message.repository.interface';

export class MessageRepository
  extends AbstractRepository<Message>
  implements MessageRepositoryInterface
{
  constructor() {
    super(AppDataSource.getRepository(Message));
  }
}
