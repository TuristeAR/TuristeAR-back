import { Place } from '../../../domain/entities/place';
import { Review } from '../../../domain/entities/review';
import { PlaceRepositoryInterface } from '../../../domain/repositories/place.repository.interface';
import { PlaceRepository } from '../../../infrastructure/repositories/place.repository';

export class FindPlaceByProvinceNameUseCase {
  private placeRepository: PlaceRepositoryInterface;

  constructor() {
    this.placeRepository = new PlaceRepository();
  }

  execute(provinceId: number): Promise<Place[]> {
    return this.placeRepository.findMany({
      where: {
        province: { id: provinceId },
      },
      relations: ['province', 'reviews'],
      select: {
        id: true,
        googleId: true,
        name: true,
        types: true,
        rating: true,
        address: true,
        reviews: {
          photos: true,
        },
        latitude: true,
        longitude: true
      },
    });
  }
}
