import { AbstractRepository } from '../../utils/abstract.repository';
import { Itinerary } from '../entities/itinerary';
import { AppDataSource } from '../../infrastructure/database/data-source';

export class ItineraryRepository extends AbstractRepository<Itinerary> {
  constructor() {
    super(AppDataSource.getRepository(Itinerary));
  }
}
