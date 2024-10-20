import { AbstractRepository } from './abstract.repository';
import { Itinerary } from '../../domain/entities/itinerary';
import { AppDataSource } from '../database/data-source';

export class ItineraryRepository extends AbstractRepository<Itinerary> {
  constructor() {
    super(AppDataSource.getRepository(Itinerary));
  }
}
