import { FindOneOptions } from 'typeorm';
import { PriceLevel } from '../entities/price_level';

export interface PriceLevelRepositoryInterface {
  findMany(options: FindOneOptions<PriceLevel>): Promise<PriceLevel[]>;
}
