import { AbstractRepository } from './abstract.repository';
import { Itinerary } from '../../domain/entities/itinerary';
import { AppDataSource } from '../database/data-source';
import { ItineraryRepositoryInterface } from '../../domain/repositories/itinerary.repository.interface';

export class ItineraryRepository
  extends AbstractRepository<Itinerary>
  implements ItineraryRepositoryInterface
{
  constructor() {
    super(AppDataSource.getRepository(Itinerary));
  }
}
