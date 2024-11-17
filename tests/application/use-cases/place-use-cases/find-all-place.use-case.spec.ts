import { CreatePlaceDto } from '../../../../src/infrastructure/dtos/create-place.dto';
import { PlaceRepositoryInterface } from '../../../../src/domain/repositories/place.repository.interface';
import { FindAllPlaceUseCase } from '../../../../src/application/use-cases/place-use-cases/find-all-place.use-case';
import { Place } from '../../../../src/domain/entities/place';
import { Province } from '../../../../src/domain/entities/province';

describe('FindAllPlaceUseCase', () => {
  let placeRepository: jest.Mocked<PlaceRepositoryInterface>;
  let findAllPlaceUseCase: FindAllPlaceUseCase;

  beforeEach(() => {
    placeRepository = {
      create: jest.fn<Promise<Place>, [CreatePlaceDto]>(),
      findOne: jest.fn(),
      findMany: jest.fn(),
      findByProvinceLocalityTypes: jest.fn(),
    } as jest.Mocked<PlaceRepositoryInterface>;
    findAllPlaceUseCase = new FindAllPlaceUseCase();
    (findAllPlaceUseCase as any).placeRepository = placeRepository;
  });

  it('should return a list of places', async () => {
    const places: Place[] = [
      {
        id: 1,
        name: 'Place 1',
        province: new Province(),
        googleId: 'google-id-1',
        reviews: [],
        types: ['type1'],
        address: 'Address 1',
        locality: 'Locality 1',
        latitude: 1.0,
        longitude: 1.0,
        rating: 4.5,
        openingHours: ['9:00 AM - 5:00 PM'],
        priceLevel: '',
        phoneNumber: '1234567890',
        activities: [],
        createdAt: new Date(),
      },
      {
        id: 2,
        name: 'Place 2',
        province: new Province(),
        googleId: 'google-id-2',
        reviews: [],
        types: ['type2'],
        address: 'Address 2',
        locality: 'Locality 2',
        latitude: 2.0,
        longitude: 2.0,
        rating: 4.0,
        openingHours: ['10:00 AM - 6:00 PM'],
        priceLevel: '',
        phoneNumber: '0987654321',
        activities: [],
        createdAt: new Date(),
      },
    ];

    placeRepository.findMany.mockResolvedValue(places);

    const result = await findAllPlaceUseCase.execute();

    expect(result).toEqual(places);
    expect(placeRepository.findMany).toHaveBeenCalledWith({}, 50);
  });

  it('should return an empty list if no places are found', async () => {
    placeRepository.findMany.mockResolvedValue([]);

    const result = await findAllPlaceUseCase.execute();

    expect(result).toEqual([]);
    expect(placeRepository.findMany).toHaveBeenCalledWith({}, 50);
  });

  it('should throw an error if repository throws an error', async () => {
    placeRepository.findMany.mockRejectedValue(new Error('Repository error'));

    await expect(findAllPlaceUseCase.execute()).rejects.toThrow('Repository error');
    expect(placeRepository.findMany).toHaveBeenCalledWith({}, 50);
  });
});
