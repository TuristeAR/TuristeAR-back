import { Message } from '../../../domain/entities/message';
import { MessageRepository } from '../../../infrastructure/repositories/message.repository';
import { MessageRepositoryInterface } from '../../../domain/repositories/message.repository.interface';

export class CreateMessageUseCase {
  private messageRepository: MessageRepositoryInterface;

  constructor() {
    this.messageRepository = new MessageRepository();
  }

  execute(message: Message): Promise<Message> {
    return this.messageRepository.save(message);
  }
}
