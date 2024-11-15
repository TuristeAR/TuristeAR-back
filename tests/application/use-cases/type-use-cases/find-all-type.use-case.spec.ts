import { FindAllTypeUseCase } from '../../../../src/application/use-cases/type-use-cases/find-all-type.use-case';
import { TypeRepositoryInterface } from '../../../../src/domain/repositories/type.repository.interface';
import { Type } from '../../../../src/domain/entities/type';

describe('FindAllTypeUseCase', () => {
  let useCase: FindAllTypeUseCase;
  let mockTypeRepository: jest.Mocked<TypeRepositoryInterface>;

  beforeEach(() => {
    mockTypeRepository = {
      findMany: jest.fn(),
    };
    useCase = new FindAllTypeUseCase();
    (useCase as any).typeRepository = mockTypeRepository;
  });

  it('should return all types', async () => {
    const types: Type[] = [{ id: 1, description: '', data: [], createdAt: new Date() }];
    mockTypeRepository.findMany.mockResolvedValue(types);

    const result = await useCase.execute();

    expect(result).toEqual(types);
    expect(mockTypeRepository.findMany).toHaveBeenCalledWith({});
  });

  it('should return an empty array if no types are found', async () => {
    mockTypeRepository.findMany.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(mockTypeRepository.findMany).toHaveBeenCalledWith({});
  });

  it('should throw an error if repository throws an error', async () => {
    const error = new Error('Repository error');
    mockTypeRepository.findMany.mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow('Repository error');
    expect(mockTypeRepository.findMany).toHaveBeenCalledWith({});
  });
});
