import { Province } from "../../../../src/domain/entities/province";
import { ProvinceRepositoryInterface } from '../../../../src/domain/repositories/province.repository.interface';
import { FindAllProvinceUseCase } from '../../../../src/application/use-cases/province-use-cases/find-all-province.use-case';

// Mock del repositorio de provincias
jest.mock('../../../../src/infrastructure/repositories/province.repository');

describe('FindAllProvinceUseCase', () => {
  let findAllProvinceUseCase: FindAllProvinceUseCase;
  let mockProvinceRepository: jest.Mocked<ProvinceRepositoryInterface>;

  beforeEach(() => {
    // Creamos un mock de las funciones del repositorio utilizando jest.fn()
    mockProvinceRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
    };

    findAllProvinceUseCase = new FindAllProvinceUseCase();
    // Asignamos el mock al repositorio
    (findAllProvinceUseCase as any).provinceRepository = mockProvinceRepository;
  });

  it('should return all provinces successfully', async () => {
    const provinces: Province[] = [
      {
        id: 1,
        georefId: '123',
        weather: { id: 1, name: 'Sunny', province: {} as Province, createdAt: new Date() },
        name: 'Buenos Aires',
        description: 'A vibrant city',
        images: ['image1.jpg'],
        category: { id: 2, description: 'Category description', image: 'category.jpg', createdAt: new Date() },
        createdAt: new Date(),
        places: [],
      },
      {
        id: 2,
        georefId: '124',
        weather: { id: 2, name: 'Rainy', province: {} as Province, createdAt: new Date() },
        name: 'Cordoba',
        description: 'A historic city',
        images: ['image2.jpg'],
        category: { id: 3, description: 'Another category', image: 'category2.jpg', createdAt: new Date() },
        createdAt: new Date(),
        places: [],
      }
    ];

    // Simulamos que el repositorio devuelve las provincias
    mockProvinceRepository.findMany.mockResolvedValue(provinces);

    const result = await findAllProvinceUseCase.execute();

    // Comprobamos que el repositorio haya sido llamado correctamente
    expect(mockProvinceRepository.findMany).toHaveBeenCalledWith({});
    expect(result).toEqual(provinces);
  });

  it('should return an empty array when no provinces are found', async () => {
    // Simulamos que el repositorio no devuelve ninguna provincia
    mockProvinceRepository.findMany.mockResolvedValue([]);

    const result = await findAllProvinceUseCase.execute();

    // Comprobamos que el repositorio haya sido llamado correctamente
    expect(mockProvinceRepository.findMany).toHaveBeenCalledWith({});
    expect(result).toEqual([]);
  });
});