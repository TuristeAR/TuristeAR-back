import { AbstractRepository } from '../../utils/abstract.repository';
import { AppDataSource } from '../../data-source';
import { Province } from '../entities/province';

export class ProvinceRepository extends AbstractRepository<Province> {
  constructor() {
    super(AppDataSource.getRepository(Province));
  }
}
