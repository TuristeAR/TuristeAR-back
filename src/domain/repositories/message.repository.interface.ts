import { Message } from '../entities/message';
import { DeleteResult, FindOneOptions } from 'typeorm';
import { Itinerary } from '../entities/itinerary';

export interface MessageRepositoryInterface {
  save(message: Message): Promise<Message>;
  findMany(options: FindOneOptions<Message>): Promise<Message[]>;
  deleteMany(ids: number[]): Promise<DeleteResult>;
}
