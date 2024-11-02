import { ItineraryRepository } from '../../../infrastructure/repositories/itinerary.repository';
import { ItineraryRepositoryInterface } from '../../../domain/repositories/itinerary.repository.interface';
import { Itinerary } from '../../../domain/entities/itinerary';

export class FindItineraryByIdForDeleteUseCase {
  private itineraryRepository: ItineraryRepositoryInterface;

  constructor() {
    this.itineraryRepository = new ItineraryRepository();
  }

  execute(id: number): Promise<Itinerary | null> {
    return this.itineraryRepository.findOne({
      where: { id : id },
      relations: ['activities', 'user', 'forum.messages', 'events', 'expenses']
    });
  }
}
