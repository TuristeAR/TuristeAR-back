import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { Type } from '../../domain/entities/type';
import { TypeRepositoryInterface } from '../../domain/repositories/type.repository.interface';

export class TypeRepository extends AbstractRepository<Type> implements TypeRepositoryInterface {
  constructor() {
    super(AppDataSource.getRepository(Type));
  }
}
