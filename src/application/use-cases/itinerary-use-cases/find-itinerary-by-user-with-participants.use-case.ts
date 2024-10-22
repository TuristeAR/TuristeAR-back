import { ItineraryRepository } from '../../../infrastructure/repositories/itinerary.repository';
import { ItineraryRepositoryInterface } from '../../../domain/repositories/itinerary.repository.interface';
import { Itinerary } from '../../../domain/entities/itinerary';

export class FindItineraryByUserWithParticipantsUseCase {
  private itineraryRepository: ItineraryRepositoryInterface;

  constructor() {
    this.itineraryRepository = new ItineraryRepository();
  }

  execute(userId: number): Promise<Itinerary[]> {
    return this.itineraryRepository.findMany({
      where: [{ participants: { id: userId } }, { user: { id: userId } }],
      relations: ['participants', 'user', 'activities.place.province.category'],
      order: { id: 'DESC' }
    });
  }
}
