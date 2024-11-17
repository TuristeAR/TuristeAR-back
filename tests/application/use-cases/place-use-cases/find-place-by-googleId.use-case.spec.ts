import { CreatePlaceDto } from '../../../../src/infrastructure/dtos/create-place.dto';
import { PlaceRepositoryInterface } from '../../../../src/domain/repositories/place.repository.interface';
import { FindPlaceByGoogleIdUseCase } from '../../../../src/application/use-cases/place-use-cases/find-place-by-googleId.use-case';
import { Place } from '../../../../src/domain/entities/place';

describe('FindPlaceByGoogleIdUseCase', () => {
  let placeRepository: jest.Mocked<PlaceRepositoryInterface>;
  let findPlaceByGoogleIdUseCase: FindPlaceByGoogleIdUseCase;

  beforeEach(() => {
    placeRepository = {
      create: jest.fn<Promise<Place>, [CreatePlaceDto]>(),
      findOne: jest.fn(),
      findMany: jest.fn(),
      findByProvinceLocalityTypes: jest.fn(),
    } as jest.Mocked<PlaceRepositoryInterface>;
    findPlaceByGoogleIdUseCase = new FindPlaceByGoogleIdUseCase();
    (findPlaceByGoogleIdUseCase as any).placeRepository = placeRepository;
  });

  it('returns a place when a valid googleId is provided', async () => {
    const googleId = 'valid-google-id';
    const place = new Place();
    placeRepository.findOne.mockResolvedValue(place);

    const result = await findPlaceByGoogleIdUseCase.execute(googleId);

    expect(result).toBe(place);
    expect(placeRepository.findOne).toHaveBeenCalledWith({ where: { googleId } });
  });

  it('returns null when no place is found for the provided googleId', async () => {
    const googleId = 'non-existent-google-id';
    placeRepository.findOne.mockResolvedValue(null);

    const result = await findPlaceByGoogleIdUseCase.execute(googleId);

    expect(result).toBeNull();
    expect(placeRepository.findOne).toHaveBeenCalledWith({ where: { googleId } });
  });
});
