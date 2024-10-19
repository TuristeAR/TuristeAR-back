import { AbstractRepository } from '../../infrastructure/repositories/abstract.repository';
import { AppDataSource } from '../../infrastructure/database/data-source';
import { TypeOfCulture } from '../entities/typeOfCulture';

export class TypeOfCultureRepository extends AbstractRepository<TypeOfCulture> {
  constructor() {
    super(AppDataSource.getRepository(TypeOfCulture));
  }
}
