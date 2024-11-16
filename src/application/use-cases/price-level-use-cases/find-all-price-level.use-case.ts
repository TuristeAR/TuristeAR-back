import { PriceLevelRepositoryInterface } from '../../../domain/repositories/price_level.repository.interface';
import { PriceLevelRepository } from '../../../infrastructure/repositories/price_level.repository';
import { PriceLevel } from '../../../domain/entities/price_level';

export class FindAllPriceLevelUseCase {
  private priceLevelRepository: PriceLevelRepositoryInterface;

  constructor() {
    this.priceLevelRepository = new PriceLevelRepository();
  }

  execute(): Promise<PriceLevel[]> {
    return this.priceLevelRepository.findMany({});
  }
}
