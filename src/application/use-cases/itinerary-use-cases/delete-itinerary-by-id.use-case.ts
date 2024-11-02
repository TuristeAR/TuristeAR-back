import { PublicationRepositoryInterface } from '../../../domain/repositories/publication.repository.interface';
import { Publication } from '../../../domain/entities/publication';
import { PublicationRepository } from '../../../infrastructure/repositories/publication.repository';
import { DeleteResult } from 'typeorm';
import { ItineraryRepositoryInterface } from '../../../domain/repositories/itinerary.repository.interface';
import { ItineraryRepository } from '../../../infrastructure/repositories/itinerary.repository';
import { Itinerary } from '../../../domain/entities/itinerary';

export class DeleteItineraryByIdUseCase {
  private itineraryRepository: ItineraryRepositoryInterface;

  constructor() {
    this.itineraryRepository = new ItineraryRepository();
  }

  execute(itinerary: Itinerary): Promise<DeleteResult> {
    return this.itineraryRepository.deleteOne(itinerary.id);
  }
}
