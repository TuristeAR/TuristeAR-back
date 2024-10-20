import { AbstractRepository } from '../../utils/abstract.repository';
import { AppDataSource } from '../../infrastructure/database/data-source';
import { Publication } from '../entities/publication';
import { User } from '../entities/user';
import { Forum } from '../entities/forum';

export class ForumRepository extends AbstractRepository<Forum> {

  constructor() {
    super(AppDataSource.getRepository(Forum));
  }
}
