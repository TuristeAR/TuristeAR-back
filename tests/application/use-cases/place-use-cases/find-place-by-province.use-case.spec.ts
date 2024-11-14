import { Place } from '../../../../src/domain/entities/place';
import { CreatePlaceDto } from '../../../../src/infrastructure/dtos/create-place.dto';
import { PlaceRepositoryInterface } from '../../../../src/domain/repositories/place.repository.interface';
import { FindPlaceByProvinceUseCase } from '../../../../src/application/use-cases/place-use-cases/find-place-by-province.use-case';

describe('FindPlaceByProvinceUseCase', () => {
  let placeRepository: jest.Mocked<PlaceRepositoryInterface>;
  let findPlaceByProvinceUseCase: FindPlaceByProvinceUseCase;

  beforeEach(() => {
    placeRepository = {
      create: jest.fn<Promise<Place>, [CreatePlaceDto]>(),
      findOne: jest.fn(),
      findMany: jest.fn(),
      findByProvinceLocalityTypes: jest.fn(),
    } as jest.Mocked<PlaceRepositoryInterface>;
    findPlaceByProvinceUseCase = new FindPlaceByProvinceUseCase();
    (findPlaceByProvinceUseCase as any).placeRepository = placeRepository;
  });

  it('returns a list of places for a valid provinceId', async () => {
    const provinceId = 1;
    const places: Place[] = [new Place(), new Place()];
    placeRepository.findMany.mockResolvedValue(places);

    const result = await findPlaceByProvinceUseCase.execute(provinceId);

    expect(result).toEqual(places);
    expect(placeRepository.findMany).toHaveBeenCalledWith(
      {
        where: { province: { id: provinceId } },
        relations: ['province'],
      },
      50,
    );
  });

  it('returns an empty list when no places are found for the provided provinceId', async () => {
    const provinceId = 2;
    placeRepository.findMany.mockResolvedValue([]);

    const result = await findPlaceByProvinceUseCase.execute(provinceId);

    expect(result).toEqual([]);
    expect(placeRepository.findMany).toHaveBeenCalledWith(
      {
        where: { province: { id: provinceId } },
        relations: ['province'],
      },
      50,
    );
  });
});
