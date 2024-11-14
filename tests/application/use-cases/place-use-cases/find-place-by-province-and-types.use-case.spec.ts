import { CreatePlaceDto } from '../../../../src/infrastructure/dtos/create-place.dto';
import { PlaceRepositoryInterface } from '../../../../src/domain/repositories/place.repository.interface';
import { FindPlaceByProvinceAndTypesUseCase } from '../../../../src/application/use-cases/place-use-cases/find-place-by-province-and-types.use-case';
import { Place } from '../../../../src/domain/entities/place';

describe('FindPlaceByProvinceAndTypesUseCase', () => {
  let placeRepository: jest.Mocked<PlaceRepositoryInterface>;
  let findPlaceByProvinceAndTypesUseCase: FindPlaceByProvinceAndTypesUseCase;

  beforeEach(() => {
    placeRepository = {
      create: jest.fn<Promise<Place>, [CreatePlaceDto]>(),
      findOne: jest.fn(),
      findMany: jest.fn(),
      findByProvinceLocalityTypes: jest.fn(),
    } as jest.Mocked<PlaceRepositoryInterface>;
    findPlaceByProvinceAndTypesUseCase = new FindPlaceByProvinceAndTypesUseCase();
    (findPlaceByProvinceAndTypesUseCase as any).placeRepository = placeRepository;
  });

  it('returns a list of places for a valid provinceId', async () => {
    const provinceId = 1;
    const places: Place[] = [new Place(), new Place()];
    placeRepository.findMany.mockResolvedValue(places);

    const result = await findPlaceByProvinceAndTypesUseCase.execute(provinceId);

    expect(result).toEqual(places);
    expect(placeRepository.findMany).toHaveBeenCalledWith(
      {
        where: { province: { id: provinceId } },
        relations: ['province', 'reviews'],
        select: {
          id: true,
          googleId: true,
          name: true,
          types: true,
          rating: true,
          address: true,
          reviews: {
            photos: true,
          },
        },
      },
      50,
    );
  });

  it('returns an empty list when no places are found for the provided provinceId', async () => {
    const provinceId = 2;
    placeRepository.findMany.mockResolvedValue([]);

    const result = await findPlaceByProvinceAndTypesUseCase.execute(provinceId);

    expect(result).toEqual([]);
    expect(placeRepository.findMany).toHaveBeenCalledWith(
      {
        where: { province: { id: provinceId } },
        relations: ['province', 'reviews'],
        select: {
          id: true,
          googleId: true,
          name: true,
          types: true,
          rating: true,
          address: true,
          reviews: {
            photos: true,
          },
        },
      },
      50,
    );
  });
});
