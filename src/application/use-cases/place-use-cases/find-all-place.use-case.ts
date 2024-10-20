import { PlaceRepository } from '../../../infrastructure/repositories/place.repository';
import { PlaceRepositoryInterface } from '../../../domain/repositories/place.repository.interface';
import { Place } from '../../../domain/entities/place';

export class FindAllPlaceUseCase {
  private placeRepository: PlaceRepositoryInterface;

  constructor() {
    this.placeRepository = new PlaceRepository();
  }

  execute(): Promise<Place[]> {
    return this.placeRepository.findMany({});
  }
}
