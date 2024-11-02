import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { Category } from '../../domain/entities/category';
import { CategoryRepositoryInterface } from '../../domain/repositories/category.repository.interface';

export class CategoryRepository
  extends AbstractRepository<Category>
  implements CategoryRepositoryInterface
{
  constructor() {
    super(AppDataSource.getRepository(Category));
  }
}
