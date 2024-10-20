import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { Province } from '../../domain/entities/province';
import { ProvinceRepositoryInterface } from '../../domain/repositories/province.repository.interface';

export class ProvinceRepository
  extends AbstractRepository<Province>
  implements ProvinceRepositoryInterface
{
  constructor() {
    super(AppDataSource.getRepository(Province));
  }
}
