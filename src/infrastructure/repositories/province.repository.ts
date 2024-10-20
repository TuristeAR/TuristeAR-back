import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { Province } from '../../domain/entities/province';

export class ProvinceRepository extends AbstractRepository<Province> {
  constructor() {
    super(AppDataSource.getRepository(Province));
  }
}
