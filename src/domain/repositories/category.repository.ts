import { AbstractRepository } from '../../utils/abstract.repository';
import { Itinerary } from '../entities/itinerary';
import { AppDataSource } from '../../infrastructure/database/data-source';
import { Category } from '../entities/category';

export class CategoryRepository extends AbstractRepository<Category> {
  constructor() {
    super(AppDataSource.getRepository(Category));
  }
}
