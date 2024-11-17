import { FindProvinceByIdUseCase } from '../../../../src/application/use-cases/province-use-cases/find-province-by-id.use-case';
import { ProvinceRepositoryInterface } from '../../../../src/domain/repositories/province.repository.interface';
import { Province } from '../../../../src/domain/entities/province';

// Mock del repositorio de provincias
jest.mock('../../../../src/infrastructure/repositories/province.repository');

describe('FindProvinceByIdUseCase', () => {
  let findProvinceByIdUseCase: FindProvinceByIdUseCase;
  let mockProvinceRepository: jest.Mocked<ProvinceRepositoryInterface>;

  beforeEach(() => {
    // Creamos un mock de las funciones del repositorio utilizando jest.fn()
    mockProvinceRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
    };

    findProvinceByIdUseCase = new FindProvinceByIdUseCase();
    // Asignamos el mock al repositorio
    (findProvinceByIdUseCase as any).provinceRepository = mockProvinceRepository;
  });

  it('should return the province when found by id', async () => {
    const provinceId = 1;

    const province: Province = {
      id: provinceId,
      georefId: '123',
      weather: { id: 1, name: 'Sunny', province: {} as Province, createdAt: new Date() },
      name: 'Buenos Aires',
      description: 'A vibrant city',
      images: ['image1.jpg'],
      category: { id: 2, description: 'Category description', image: 'category.jpg', createdAt: new Date() },
      createdAt: new Date(),
      places: [],
    };

    // Simulamos que el repositorio devuelve la provincia
    mockProvinceRepository.findOne.mockResolvedValue(province);

    const result = await findProvinceByIdUseCase.execute(provinceId);

    // Comprobamos que el repositorio haya sido llamado correctamente
    expect(mockProvinceRepository.findOne).toHaveBeenCalledWith({ where: { id: provinceId } });
    expect(result).toEqual(province);
  });

  it('should return null when no province is found by id', async () => {
    const provinceId = 999; // Un id que no existe en la base de datos

    // Simulamos que el repositorio no encuentra la provincia
    mockProvinceRepository.findOne.mockResolvedValue(null);

    const result = await findProvinceByIdUseCase.execute(provinceId);

    // Comprobamos que el repositorio haya sido llamado correctamente
    expect(mockProvinceRepository.findOne).toHaveBeenCalledWith({ where: { id: provinceId } });
    expect(result).toBeNull();
  });
});
