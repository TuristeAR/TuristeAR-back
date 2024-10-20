import { AbstractRepository } from './abstract.repository';
import { Place } from '../../domain/entities/place';
import { AppDataSource } from '../database/data-source';

export class PlaceRepository extends AbstractRepository<Place> {
  constructor() {
    super(AppDataSource.getRepository(Place));
  }

  async find(criteria: any): Promise<Place[]> {
    return this.repository.find(criteria);
  }
}
