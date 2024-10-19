import { CategoryRepository } from '../repositories/category.repository';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  findAll() {
    return this.categoryRepository.findMany({});
  }

  findById(id: number) {
    return this.categoryRepository.findOne({ where: { id: id } });
  }
}
