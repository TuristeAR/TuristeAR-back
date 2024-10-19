import { AbstractRepository } from '../../infrastructure/repositories/abstract.repository';
import { Place } from '../entities/place';
import { AppDataSource } from '../../infrastructure/database/data-source';

export class PlaceRepository extends AbstractRepository<Place> {
  constructor() {
    super(AppDataSource.getRepository(Place));
  }

  async find(criteria: any): Promise<Place[]> {
    return this.repository.find(criteria);
  }
}
