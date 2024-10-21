import { CategoryRepository } from '../../../infrastructure/repositories/category.repository';
import { CategoryRepositoryInterface } from '../../../domain/repositories/category.repository.interface';
import { Category } from '../../../domain/entities/category';

export class FindCategoryByIdUseCase {
  private categoryRepository: CategoryRepositoryInterface;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  execute(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { id } });
  }
}
