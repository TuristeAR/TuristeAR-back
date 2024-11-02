import { Place } from '../../../domain/entities/place';
import { PlaceRepositoryInterface } from '../../../domain/repositories/place.repository.interface';
import { PlaceRepository } from '../../../infrastructure/repositories/place.repository';

export class FindPlaceByProvinceAndTypesUseCase {
  private placeRepository: PlaceRepositoryInterface;

  constructor() {
    this.placeRepository = new PlaceRepository();
  }

  //types nunca se utiliza en el where para consultar ...
  execute(provinceId: number,types: string[]): Promise<Place[]> {
    return this.placeRepository.findMany(
      {
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
        },
      },
      50,
    );
  }




  
}

