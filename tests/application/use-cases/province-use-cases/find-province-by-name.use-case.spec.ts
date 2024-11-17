import { FindProvinceByNameUseCase } from '../../../../src/application/use-cases/province-use-cases/find-province-by-name.use-case';
import { ProvinceRepositoryInterface } from '../../../../src/domain/repositories/province.repository.interface';
import { Province } from '../../../../src/domain/entities/province';

// Mock del repositorio de provincias
jest.mock('../../../../src/infrastructure/repositories/province.repository');

describe('FindProvinceByNameUseCase', () => {
  let findProvinceByNameUseCase: FindProvinceByNameUseCase;
  let mockProvinceRepository: jest.Mocked<ProvinceRepositoryInterface>;

  beforeEach(() => {
    // Creamos un mock de las funciones del repositorio utilizando jest.fn()
    mockProvinceRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
    };

    findProvinceByNameUseCase = new FindProvinceByNameUseCase();
    // Asignamos el mock al repositorio
    (findProvinceByNameUseCase as any).provinceRepository = mockProvinceRepository;
  });

  it('should return the province when found by name', async () => {
    const provinceName = 'Buenos Aires';

    const province: Province = {
      id: 1,
      georefId: '123',
      weather: { id: 1, name: 'Sunny', province: {} as Province, createdAt: new Date() },
      name: provinceName,
      description: 'A vibrant city',
      images: ['image1.jpg'],
      category: { id: 2, description: 'Category description', image: 'category.jpg', createdAt: new Date() },
      createdAt: new Date(),
      places: [],
    };

    // Simulamos que el repositorio devuelve la provincia
    mockProvinceRepository.findOne.mockResolvedValue(province);

    const result = await findProvinceByNameUseCase.execute(provinceName);

    // Comprobamos que el repositorio haya sido llamado correctamente
    expect(mockProvinceRepository.findOne).toHaveBeenCalledWith({ where: { name: provinceName } });
    expect(result).toEqual(province);
  });

  it('should return null when no province is found by name', async () => {
    const provinceName = 'Cordoba';

    // Simulamos que el repositorio no encuentra la provincia
    mockProvinceRepository.findOne.mockResolvedValue(null);

    const result = await findProvinceByNameUseCase.execute(provinceName);

    // Comprobamos que el repositorio haya sido llamado correctamente
    expect(mockProvinceRepository.findOne).toHaveBeenCalledWith({ where: { name: provinceName } });
    expect(result).toBeNull();
  });
});
