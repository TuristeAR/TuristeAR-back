import { AbstractRepository } from '../../infrastructure/repositories/abstract.repository';
import { AppDataSource } from '../../infrastructure/database/data-source';
import { Province } from '../entities/province';

export class ProvinceRepository extends AbstractRepository<Province> {
  constructor() {
    super(AppDataSource.getRepository(Province));
  }
}
