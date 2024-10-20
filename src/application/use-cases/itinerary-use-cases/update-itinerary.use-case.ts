import { ItineraryRepositoryInterface } from '../../../domain/repositories/itinerary.repository.interface';
import { Itinerary } from '../../../domain/entities/itinerary';
import { ItineraryRepository } from '../../../infrastructure/repositories/itinerary.repository';

export class UpdateItineraryUseCase {
  private itineraryRepository: ItineraryRepositoryInterface;

  constructor() {
    this.itineraryRepository = new ItineraryRepository();
  }

  execute(itinerary: Itinerary): Promise<Itinerary> {
    return this.itineraryRepository.save(itinerary);
  }
}