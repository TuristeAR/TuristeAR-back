import { AbstractRepository } from '../../infrastructure/repositories/abstract.repository';
import { AppDataSource } from '../../infrastructure/database/data-source';
import { Culture } from '../entities/culture';

export class CultureRepository extends AbstractRepository<Culture> {
  constructor() {
    super(AppDataSource.getRepository(Culture));
  }
}
