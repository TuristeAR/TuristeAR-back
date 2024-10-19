import { AbstractRepository } from '../../infrastructure/repositories/abstract.repository';
import { AppDataSource } from '../../infrastructure/database/data-source';
import { Category } from '../entities/category';

export class CategoryRepository extends AbstractRepository<Category> {
  constructor() {
    super(AppDataSource.getRepository(Category));
  }
}
