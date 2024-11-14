import { CategoryRepositoryInterface } from '../../../../src/domain/repositories/category.repository.interface';
import { FindAllCategoryUseCase } from '../../../../src/application/use-cases/category-use-cases/find-all-category.use-case';
import { Category } from '../../../../src/domain/entities/category';

describe('FindAllCategoryUseCase', () => {
  let categoryRepository: CategoryRepositoryInterface;
  let findAllCategoryUseCase: FindAllCategoryUseCase;

  beforeEach(() => {
    categoryRepository = {
      findMany: jest.fn(),
    } as unknown as CategoryRepositoryInterface;
    findAllCategoryUseCase = new FindAllCategoryUseCase();
    (findAllCategoryUseCase as any).categoryRepository = categoryRepository;
  });

  it('should return all categories', async () => {
    const categories: Category[] = [
      {
        id: 1,
        description: 'Category 1',
        image: 'image',
        createdAt: new Date(),
      },
    ];
    (categoryRepository.findMany as jest.Mock).mockResolvedValue(categories);

    const result = await findAllCategoryUseCase.execute();

    expect(result).toEqual(categories);
  });

  it('should return an empty array if no categories found', async () => {
    (categoryRepository.findMany as jest.Mock).mockResolvedValue([]);

    const result = await findAllCategoryUseCase.execute();

    expect(result).toEqual([]);
  });
});
