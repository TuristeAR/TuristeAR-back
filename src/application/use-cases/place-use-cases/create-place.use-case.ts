import { PlaceRepositoryInterface } from '../../../domain/repositories/place.repository.interface';
import { CreatePlaceDto } from '../../../infrastructure/dtos/create-place.dto';
import { Place } from '../../../domain/entities/place';
import { PlaceRepository } from '../../../infrastructure/repositories/place.repository';

export class CreatePlaceUseCase {
  private placeRepository: PlaceRepositoryInterface;

  constructor() {
    this.placeRepository = new PlaceRepository();
  }

  execute(createPlaceDto: CreatePlaceDto): Promise<Place> {
    return this.placeRepository.create(createPlaceDto);
  }
}
