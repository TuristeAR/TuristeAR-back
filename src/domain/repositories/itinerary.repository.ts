import { AbstractRepository } from '../../infrastructure/repositories/abstract.repository';
import { Itinerary } from '../entities/itinerary';
import { AppDataSource } from '../../infrastructure/database/data-source';

export class ItineraryRepository extends AbstractRepository<Itinerary> {
  constructor() {
    super(AppDataSource.getRepository(Itinerary));
  }
}
