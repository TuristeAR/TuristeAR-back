import { CategoryRepositoryInterface } from '../../../../src/domain/repositories/category.repository.interface';
import { FindCategoryByIdUseCase } from '../../../../src/application/use-cases/category-use-cases/find-category-by-id.use-case';
import { Category } from '../../../../src/domain/entities/category';

describe('FindCategoryByIdUseCase', () => {
  let categoryRepository: CategoryRepositoryInterface;
  let findCategoryByIdUseCase: FindCategoryByIdUseCase;

  beforeEach(() => {
    categoryRepository = {
      findOne: jest.fn(),
    } as unknown as CategoryRepositoryInterface;
    findCategoryByIdUseCase = new FindCategoryByIdUseCase();
    (findCategoryByIdUseCase as any).categoryRepository = categoryRepository;
  });

  it('should return the category with the given id', async () => {
    const category: Category = {
      id: 1,
      description: 'Category 1',
      image: 'image',
      createdAt: new Date(),
    };
    (categoryRepository.findOne as jest.Mock).mockResolvedValue(category);

    const result = await findCategoryByIdUseCase.execute(1);

    expect(result).toEqual(category);
  });

  it('should return null if no category found with the given id', async () => {
    (categoryRepository.findOne as jest.Mock).mockResolvedValue(null);

    const result = await findCategoryByIdUseCase.execute(1);

    expect(result).toBeNull();
  });
});
