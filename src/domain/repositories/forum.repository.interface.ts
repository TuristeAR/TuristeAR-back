import { FindOneOptions } from 'typeorm';
import { Forum } from '../entities/forum';

export interface ForumRepositoryInterface {
  findOne(options: FindOneOptions<Forum>): Promise<Forum | null>;
  findMany(options: FindOneOptions<Forum>): Promise<Forum[]>;
  save(forum: Forum): Promise<Forum>;
}
