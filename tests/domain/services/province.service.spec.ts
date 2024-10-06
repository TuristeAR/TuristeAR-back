import { CreateProvinceDto } from '../../../src/application/dtos/create-province.dto';
import { ProvinceRepository } from '../../../src/domain/repositories/province.repository';
import { ProvinceService } from '../../../src/domain/services/province.service';
import { Province } from '../../../src/domain/entities/province';

jest.mock('../../../src/domain/repositories/province.repository');

describe('ProvinceService', () => {
  let provinceService: ProvinceService;
  let provinceRepository: jest.Mocked<ProvinceRepository>;

  beforeEach(() => {
    provinceRepository = new ProvinceRepository() as jest.Mocked<ProvinceRepository>;
    provinceService = new ProvinceService();
    (provinceService as any).provinceRepository = provinceRepository;
  });

  it('creates a new province', async () => {
    const createProvinceDto: CreateProvinceDto = {
      georefId: 'some-georef-id',
      weatherId: 123,
      name: 'Test Province',
      description: 'A description of the test province',
      images: ['image1.jpg', 'image2.jpg'],
    };

    await provinceService.create(createProvinceDto);

    expect(provinceRepository.create).toHaveBeenCalledWith(createProvinceDto);
  });

  it('finds all provinces', async () => {
    const provinces = [{ id: 1, name: 'Test Province' }] as Province[];

    provinceRepository.findMany.mockResolvedValue(provinces);

    const result = await provinceService.findAll();

    expect(result).toEqual(provinces);
    expect(provinceRepository.findMany).toHaveBeenCalledWith({});
  });

  it('finds a province by id', async () => {
    const province = { id: 1, name: 'Test Province' } as Province;

    provinceRepository.findOne.mockResolvedValue(province);

    const result = await provinceService.findOneById(1);

    expect(result).toEqual(province);
    expect(provinceRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('returns null if province not found by id', async () => {
    provinceRepository.findOne.mockResolvedValue(null);

    const result = await provinceService.findOneById(999);

    expect(result).toBeNull();
    expect(provinceRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
  });
});
