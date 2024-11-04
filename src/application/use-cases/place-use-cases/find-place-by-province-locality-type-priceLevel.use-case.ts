import { Place } from '../../../domain/entities/place';
import { PlaceRepositoryInterface } from '../../../domain/repositories/place.repository.interface';
import { PlaceRepository } from '../../../infrastructure/repositories/place.repository';

export class FindPlaceByProvinceLocalityTypeAndPriceLevelUseCase {
  private placeRepository: PlaceRepositoryInterface;

  constructor() {
    this.placeRepository = new PlaceRepository();
  }

  execute(
    provinceId: number,
    locality: string,
    type: string,
    priceLevel: string[],
  ): Promise<Place[]> {
    return this.placeRepository.findByProvinceLocalityTypes(provinceId, locality, type, priceLevel);
  }
}
