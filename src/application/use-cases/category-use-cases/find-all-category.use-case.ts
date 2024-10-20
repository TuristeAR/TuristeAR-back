import { CategoryRepository } from '../../../infrastructure/repositories/category.repository';
import { CategoryRepositoryInterface } from '../../../domain/repositories/category.repository.interface';
import { Category } from '../../../domain/entities/category';

export class FindAllCategoryUseCase {
  private categoryRepository: CategoryRepositoryInterface;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  execute(): Promise<Category[]> {
    return this.categoryRepository.findMany({});
  }
}