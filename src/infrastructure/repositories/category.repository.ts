import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { Category } from '../../domain/entities/category';

export class CategoryRepository extends AbstractRepository<Category> {
  constructor() {
    super(AppDataSource.getRepository(Category));
  }
}
