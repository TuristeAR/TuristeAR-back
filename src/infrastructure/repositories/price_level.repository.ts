import { PriceLevel } from '../../domain/entities/price_level';
import { AbstractRepository } from './abstract.repository';
import { PriceLevelRepositoryInterface } from '../../domain/repositories/price_level.repository.interface';
import { AppDataSource } from '../database/data-source';

export class PriceLevelRepository
  extends AbstractRepository<PriceLevel>
  implements PriceLevelRepositoryInterface
{
  constructor() {
    super(AppDataSource.getRepository(PriceLevel));
  }
}
