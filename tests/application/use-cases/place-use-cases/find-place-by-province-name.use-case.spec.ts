import { FindPlaceByProvinceNameUseCase } from '../../../../src/application/use-cases/place-use-cases/find-place-by-province-name.use-case';
import { PlaceRepositoryInterface } from '../../../../src/domain/repositories/place.repository.interface';
import { Place } from '../../../../src/domain/entities/place';

describe('FindPlaceByProvinceNameUseCase', () => {
  let useCase: FindPlaceByProvinceNameUseCase;
  let placeRepository: jest.Mocked<PlaceRepositoryInterface>;

  beforeEach(() => {
    placeRepository = {
      findMany: jest.fn(),
    } as unknown as jest.Mocked<PlaceRepositoryInterface>;
    useCase = new FindPlaceByProvinceNameUseCase();
    (useCase as any).placeRepository = placeRepository;
  });

  it('returns places for a valid province id', async () => {
    const places: Place[] = [new Place(), new Place()];
    placeRepository.findMany.mockResolvedValue(places);

    const result = await useCase.execute(1);

    expect(result).toEqual(places);
    expect(placeRepository.findMany).toHaveBeenCalledWith(
      {
        where: { province: { id: 1 } },
        relations: ['province', 'reviews'],
        select: {
          id: true,
          googleId: true,
          name: true,
          types: true,
          rating: true,
          address: true,
          reviews: { photos: true },
          latitude: true,
          longitude: true,
        },
      },
      50,
    );
  });

  it('returns an empty array if no places are found', async () => {
    placeRepository.findMany.mockResolvedValue([]);

    const result = await useCase.execute(999);

    expect(result).toEqual([]);
    expect(placeRepository.findMany).toHaveBeenCalledWith(
      {
        where: { province: { id: 999 } },
        relations: ['province', 'reviews'],
        select: {
          id: true,
          googleId: true,
          name: true,
          types: true,
          rating: true,
          address: true,
          reviews: { photos: true },
          latitude: true,
          longitude: true,
        },
      },
      50,
    );
  });

  it('throws an error if the repository throws an error', async () => {
    placeRepository.findMany.mockRejectedValue(new Error('Repository error'));

    await expect(useCase.execute(1)).rejects.toThrow('Repository error');
  });
});
