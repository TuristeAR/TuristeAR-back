import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { Forum } from '../../domain/entities/forum';
import { ForumRepositoryInterface } from '../../domain/repositories/forum.repository.interface';

export class ForumRepository extends AbstractRepository<Forum> implements ForumRepositoryInterface {
  constructor() {
    super(AppDataSource.getRepository(Forum));
  }
}
