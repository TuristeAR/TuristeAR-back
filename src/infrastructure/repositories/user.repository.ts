import { User } from '../../domain/entities/user';
import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';

export class UserRepository extends AbstractRepository<User> {
  constructor() {
    super(AppDataSource.getRepository(User));
  }
  findAll(): Promise<User[]> {
    return this.repository.find();
  }
}
