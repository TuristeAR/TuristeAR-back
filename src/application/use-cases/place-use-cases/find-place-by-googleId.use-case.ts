import { Place } from '../../../domain/entities/place';
import { PlaceRepositoryInterface } from '../../../domain/repositories/place.repository.interface';
import { PlaceRepository } from '../../../infrastructure/repositories/place.repository';

export class FindPlaceByGoogleIdUseCase {
  private placeRepository: PlaceRepositoryInterface;

  constructor() {
    this.placeRepository = new PlaceRepository();
  }

  execute(googleId: string): Promise<Place | null> {
    return this.placeRepository.findOne({ where: { googleId } });
  }
}
