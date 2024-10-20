import { PublicationRepository } from '../repositories/publication.repository';
import { Publication } from '../entities/publication';
import { CreatePublicationDTO } from '../../application/dtos/create-publication.dto';
import { UserRepository } from '../repositories/user.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { Category } from '../entities/category';
import { User } from '../entities/user';
import { ForumRepository } from '../repositories/forum.repository';
import { Forum } from '../entities/forum';
import { MessageRepository } from '../repositories/message.repository';
import { Message } from '../entities/message';

export class MessageService {

  private messageRepository: MessageRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
  }

  async createMessage(message: Message){
    await this.messageRepository.save(message);
  }
}