import { ItineraryRepository } from '../../../infrastructure/repositories/itinerary.repository';
import { ItineraryRepositoryInterface } from '../../../domain/repositories/itinerary.repository.interface';
import { Itinerary } from '../../../domain/entities/itinerary';
import { User } from '../../../domain/entities/user';

export class FindItineraryByUserUseCase {
  private itineraryRepository: ItineraryRepositoryInterface;

  constructor() {
    this.itineraryRepository = new ItineraryRepository();
  }

  execute(user: User): Promise<Itinerary[]> {
    return this.itineraryRepository.findMany({ where: { user : {id : user.id} }, relations: ['activities.place.province.category'], order: { id: 'DESC' } });
  }
}
