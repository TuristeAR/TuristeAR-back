import { Message } from '../entities/message';

export interface MessageRepositoryInterface {
  save(message: Message): Promise<Message>;
}
