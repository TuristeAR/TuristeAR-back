import { DeleteResult, FindOneOptions } from 'typeorm';
import { Event } from '../entities/event';

export interface EventRepositoryInterface {
  findOne(options: FindOneOptions<Event>): Promise<Event | null>;
  findMany(options: FindOneOptions<Event>): Promise<Event[]>;

  deleteMany(ids: number[]): Promise<DeleteResult>;
}
