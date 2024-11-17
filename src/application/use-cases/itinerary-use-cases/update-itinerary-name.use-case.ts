import { ItineraryRepositoryInterface } from '../../../domain/repositories/itinerary.repository.interface';
import { ItineraryRepository } from '../../../infrastructure/repositories/itinerary.repository';

export class UpdateItineraryNameUseCase {
  private itineraryRepository: ItineraryRepositoryInterface;

  constructor() {
    this.itineraryRepository = new ItineraryRepository();
  }

  execute(itineraryId: number, name: string) {
    return this.itineraryRepository.update(itineraryId, { name });
  }
}
