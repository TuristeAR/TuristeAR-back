import { PlaceRepositoryInterface } from '../../../../src/domain/repositories/place.repository.interface';
import { FindPlaceByProvinceLocalityTypeAndPriceLevelUseCase } from '../../../../src/application/use-cases/place-use-cases/find-place-by-province-locality-type-priceLevel.use-case';
import { Place } from '../../../../src/domain/entities/place';

describe('FindPlaceByProvinceLocalityTypeAndPriceLevelUseCase', () => {
  let useCase: FindPlaceByProvinceLocalityTypeAndPriceLevelUseCase;
  let placeRepository: jest.Mocked<PlaceRepositoryInterface>;

  beforeEach(() => {
    placeRepository = {
      findByProvinceLocalityTypes: jest.fn(),
    } as unknown as jest.Mocked<PlaceRepositoryInterface>;
    useCase = new FindPlaceByProvinceLocalityTypeAndPriceLevelUseCase();
    (useCase as any).placeRepository = placeRepository;
  });

  it('should return places for valid inputs', async () => {
    const places: Place[] = [{ id: 1, name: 'Place 1' } as Place];
    placeRepository.findByProvinceLocalityTypes.mockResolvedValue(places);

    const result = await useCase.execute(1, 'Locality', 'Type', ['Low', 'Medium']);

    expect(result).toEqual(places);
    expect(placeRepository.findByProvinceLocalityTypes).toHaveBeenCalledWith(
      1,
      'Locality',
      'Type',
      ['Low', 'Medium'],
    );
  });

  it('should return an empty array if no places are found', async () => {
    placeRepository.findByProvinceLocalityTypes.mockResolvedValue([]);

    const result = await useCase.execute(1, 'Locality', 'Type', ['Low', 'Medium']);

    expect(result).toEqual([]);
    expect(placeRepository.findByProvinceLocalityTypes).toHaveBeenCalledWith(
      1,
      'Locality',
      'Type',
      ['Low', 'Medium'],
    );
  });

  it('should throw an error if repository throws an error', async () => {
    placeRepository.findByProvinceLocalityTypes.mockRejectedValue(new Error('Repository error'));

    await expect(useCase.execute(1, 'Locality', 'Type', ['Low', 'Medium'])).rejects.toThrow(
      'Repository error',
    );
  });
});
