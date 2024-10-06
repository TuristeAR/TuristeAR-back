import { User } from '../entities/user';
import { AbstractRepository } from '../../utils/abstract.repository';
import { AppDataSource } from '../../data-source';

export class UserRepository extends AbstractRepository<User> {
  constructor() {
    super(AppDataSource.getRepository(User));
  }
}
