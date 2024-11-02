import { AbstractRepository } from './abstract.repository';
import { Place } from '../../domain/entities/place';
import { AppDataSource } from '../database/data-source';
import { PlaceRepositoryInterface } from '../../domain/repositories/place.repository.interface';

export class PlaceRepository extends AbstractRepository<Place> implements PlaceRepositoryInterface {
  constructor() {
    super(AppDataSource.getRepository(Place));
  }

  async find(criteria: any): Promise<Place[]> {
    return this.repository.find(criteria);
  }
}
