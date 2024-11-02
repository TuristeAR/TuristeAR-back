import { User } from '../../domain/entities/user';
import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { UserRepositoryInterface } from '../../domain/repositories/user.repository.interface';

export class UserRepository extends AbstractRepository<User> implements UserRepositoryInterface {
  constructor() {
    super(AppDataSource.getRepository(User));
  }
  findAll(): Promise<User[]> {
    return this.repository.find();
  }
}
