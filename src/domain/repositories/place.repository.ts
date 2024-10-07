import { AbstractRepository } from '../../utils/abstract.repository';
import { Place } from '../entities/place';
import { AppDataSource } from '../../infrastructure/database/data-source';

export class PlaceRepository extends AbstractRepository<Place> {
  constructor() {
    super(AppDataSource.getRepository(Place));
  }
}
