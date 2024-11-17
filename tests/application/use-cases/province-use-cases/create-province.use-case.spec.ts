import { Province } from "../../../../src/domain/entities/province";
import { ProvinceRepositoryInterface } from '../../../../src/domain/repositories/province.repository.interface';
import { CreateProvinceUseCase } from '../../../../src/application/use-cases/province-use-cases/create-province.use-case';
import { CreateProvinceDto } from "../../../../src/infrastructure/dtos/create-province.dto";

describe('CreateProvinceUseCase', () => {
  let createProvinceUseCase: CreateProvinceUseCase;
  let mockProvinceRepository: jest.Mocked<ProvinceRepositoryInterface>;

  beforeEach(() => {
    mockProvinceRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
    };

    createProvinceUseCase = new CreateProvinceUseCase();
    (createProvinceUseCase as any).provinceRepository = mockProvinceRepository;
  });

  it('should create a new province successfully', async () => {
    const provinceData: CreateProvinceDto = {
      georefId: '123',
      weatherId: 1,
      name: 'Buenos Aires',
      description: 'A vibrant city',
      images: ['image1.jpg'],
      categoryId: 2,
    };

    const createdProvince: Province = {
      id: 1,
      ...provinceData,
      createdAt: new Date(),
      weather: { id: 1, name: 'Sunny', province: {} as Province, createdAt: new Date() },
      category: { id: 2, description: 'Category description', image: 'category.jpg', createdAt: new Date() },
      places: [],
    };

    mockProvinceRepository.create.mockResolvedValue(createdProvince);

    const result = await createProvinceUseCase.execute(provinceData);

    expect(mockProvinceRepository.create).toHaveBeenCalledWith(provinceData);
    expect(result).toEqual(createdProvince);
  });

  it('should throw an error if creation fails', async () => {
    const provinceData: CreateProvinceDto = {
      georefId: '123',
      weatherId: 1,
      name: 'Buenos Aires',
      description: 'A vibrant city',
      images: ['image1.jpg'],
      categoryId: 2,
    };

   
    mockProvinceRepository.create.mockRejectedValue(new Error('Creation failed'));

    await expect(createProvinceUseCase.execute(provinceData)).rejects.toThrow('Creation failed');
  });
});
