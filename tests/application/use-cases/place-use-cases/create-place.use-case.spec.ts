import { PlaceRepositoryInterface } from '../../../../src/domain/repositories/place.repository.interface';
import { CreatePlaceUseCase } from '../../../../src/application/use-cases/place-use-cases/create-place.use-case';
import { Place } from '../../../../src/domain/entities/place';
import { CreatePlaceDto } from '../../../../src/infrastructure/dtos/create-place.dto';
import { Province } from '../../../../src/domain/entities/province';

describe('CreatePlaceUseCase', () => {
  let placeRepository: jest.Mocked<PlaceRepositoryInterface>;
  let createPlaceUseCase: CreatePlaceUseCase;

  beforeEach(() => {
    placeRepository = {
      create: jest.fn<Promise<Place>, [CreatePlaceDto]>(),
      findOne: jest.fn(),
      findMany: jest.fn(),
      findByProvinceLocalityTypes: jest.fn(),
    } as jest.Mocked<PlaceRepositoryInterface>;
    createPlaceUseCase = new CreatePlaceUseCase();
    (createPlaceUseCase as any).placeRepository = placeRepository;
  });

  it('should create a place successfully', async () => {
    const createPlaceDto: CreatePlaceDto = {
      name: 'Test Place',
      province: new Province(),
      googleId: 'test-google-id',
      types: ['type1', 'type2'],
      address: 'Test Address',
      locality: 'Test Locality',
      latitude: 1.0,
      longitude: 1.0,
      rating: 4.5,
      openingHours: ['openingHours1', 'openingHours2'],
      priceLevel: '',
      phoneNumber: '1234567890',
    };

    const place: Place = {
      id: 1,
      name: 'Test Place',
      province: new Province(),
      googleId: 'test-google-id',
      reviews: [],
      types: ['type1', 'type2'],
      address: 'Test Address',
      locality: 'Test Locality',
      latitude: 1.0,
      longitude: 1.0,
      rating: 4.5,
      openingHours: ['openingHours1', 'openingHours2'],
      priceLevel: '',
      phoneNumber: '1234567890',
      activities: [],
      createdAt: new Date(),
    };

    placeRepository.create.mockResolvedValue(place);

    const result = await createPlaceUseCase.execute(createPlaceDto);

    expect(result).toEqual(place);
    expect(placeRepository.create).toHaveBeenCalledWith(createPlaceDto);
  });

  it('should throw an error if place creation fails', async () => {
    const createPlaceDto: CreatePlaceDto = {
      name: 'Test Place',
      province: new Province(),
      googleId: 'test-google-id',
      types: ['type1', 'type2'],
      address: 'Test Address',
      locality: 'Test Locality',
      latitude: 1.0,
      longitude: 1.0,
      rating: 4.5,
      openingHours: ['openingHours1', 'openingHours2'],
      priceLevel: '',
      phoneNumber: '1234567890',
    };
    placeRepository.create.mockRejectedValue(new Error('Creation failed'));

    await expect(createPlaceUseCase.execute(createPlaceDto)).rejects.toThrow('Creation failed');
    expect(placeRepository.create).toHaveBeenCalledWith(createPlaceDto);
  });
});
