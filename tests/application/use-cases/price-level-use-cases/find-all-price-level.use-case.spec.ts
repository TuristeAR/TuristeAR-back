import { FindAllPriceLevelUseCase } from '../../../../src/application/use-cases/price-level-use-cases/find-all-price-level.use-case';
import { PriceLevelRepositoryInterface } from '../../../../src/domain/repositories/price_level.repository.interface';
import { PriceLevel } from '../../../../src/domain/entities/price_level';

describe('FindAllPriceLevelUseCase', () => {
  let useCase: FindAllPriceLevelUseCase;
  let mockPriceLevelRepository: jest.Mocked<PriceLevelRepositoryInterface>;

  beforeEach(() => {
    mockPriceLevelRepository = {
      findMany: jest.fn(),
    };
    useCase = new FindAllPriceLevelUseCase();
    (useCase as any).priceLevelRepository = mockPriceLevelRepository;
  });

  it('should return all price levels', async () => {
    const priceLevels: PriceLevel[] = [{ id: 1, description: '', data: [], createdAt: new Date() }];
    mockPriceLevelRepository.findMany.mockResolvedValue(priceLevels);

    const result = await useCase.execute();

    expect(result).toEqual(priceLevels);
    expect(mockPriceLevelRepository.findMany).toHaveBeenCalledWith({});
  });

  it('should return an empty array if no price levels are found', async () => {
    mockPriceLevelRepository.findMany.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(mockPriceLevelRepository.findMany).toHaveBeenCalledWith({});
  });

  it('should throw an error if repository throws an error', async () => {
    const error = new Error('Repository error');
    mockPriceLevelRepository.findMany.mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow('Repository error');
    expect(mockPriceLevelRepository.findMany).toHaveBeenCalledWith({});
  });
});
