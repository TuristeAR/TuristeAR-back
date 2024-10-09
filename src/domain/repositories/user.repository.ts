import { User } from '../entities/user';
import { AbstractRepository } from '../../utils/abstract.repository';
import { AppDataSource } from '../../infrastructure/database/data-source';

export class PublicationRepository extends AbstractRepository<User> {
  constructor() {
    super(AppDataSource.getRepository(User));
  }
  findAll(): Promise<User[]>{
    return this.repository.find();
  }
}
