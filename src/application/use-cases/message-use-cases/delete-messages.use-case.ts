import { CommentRepositoryInterface } from '../../../domain/repositories/comment.repository.interface';
import { CommentRepository } from '../../../infrastructure/repositories/comment.repository';
import { Comment } from '../../../domain/entities/comment';
import { DeleteResult } from 'typeorm';
import { MessageRepositoryInterface } from '../../../domain/repositories/message.repository.interface';
import { MessageRepository } from '../../../infrastructure/repositories/message.repository';
import { Message } from '../../../domain/entities/message';

export class DeleteMessageUseCase {
  private messageRepository: MessageRepositoryInterface;

  constructor() {
    this.messageRepository = new MessageRepository();
  }

  execute(messages: Message[]): Promise<DeleteResult> {
    return this.messageRepository.deleteMany(messages.map(message => message.id));
  }
}
