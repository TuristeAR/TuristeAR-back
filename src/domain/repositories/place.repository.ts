import { AbstractRepository } from '../../utils/abstract.repository';
import { AppDataSource } from '../../infrastructure/database/data-source';
import { Place } from '../entities/place';

export class PlaceRepository extends AbstractRepository<Place> {
  constructor() {
    super(AppDataSource.getRepository(Place));
  }
}
