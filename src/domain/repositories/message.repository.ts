import { AbstractRepository } from '../../utils/abstract.repository';
import { AppDataSource } from '../../infrastructure/database/data-source';
import { Publication } from '../entities/publication';
import { User } from '../entities/user';
import { Forum } from '../entities/forum';
import { Message } from '../entities/message';

export class MessageRepository extends AbstractRepository<Message> {

  constructor() {
    super(AppDataSource.getRepository(Message));
  }
}
