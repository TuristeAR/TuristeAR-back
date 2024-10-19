import { CreatePlaceDto } from '../../../src/application/dtos/create-place.dto';
import { PlaceRepository } from '../../../src/domain/repositories/place.repository';
import { PlaceService } from '../../../src/domain/services/place.service';
import { Place } from '../../../src/domain/entities/place';
import { Province } from '../../../src/domain/entities/province';

jest.mock('../../../src/domain/repositories/place.repository');

describe('PlaceService', () => {
  let placeService: PlaceService;
  let placeRepository: jest.Mocked<PlaceRepository>;

  beforeEach(() => {
    placeRepository = new PlaceRepository() as jest.Mocked<PlaceRepository>;
    placeService = new PlaceService();
    (placeService as any).placeRepository = placeRepository;
  });

  it('creates a new place', async () => {
    const createPlaceDto: CreatePlaceDto = {
      province: new Province(),
      googleId: 'some-google-id',
      name: 'Test Place',
      types: ['type1', 'type2'],
      address: '123 Test St',
      latitude: 45.0,
      longitude: -75.0,
      rating: 4.5,
      openingHours: ['9:00 AM - 5:00 PM'],
      phoneNumber: '123-456-7890',
    };

    await placeService.create(createPlaceDto);

    expect(placeRepository.create).toHaveBeenCalledWith(createPlaceDto);
  });

  it('finds all places', async () => {
    const places = [{ id: 1, name: 'Test Place' }] as Place[];

    placeRepository.findMany.mockResolvedValue(places);

    const result = await placeService.findAll();

    expect(result).toEqual(places);
    expect(placeRepository.findMany).toHaveBeenCalledWith({});
  });

  it('finds a place by googleId', async () => {
    const place: Place = {
      id: 1,
      createdAt: new Date(),
      googleId: '1',
      name: 'Test Place',
      types: [],
      address: '123 Test St',
      latitude: 45.0,
      longitude: -75.0,
      rating: 4.5,
      openingHours: ['9:00 AM - 5:00 PM'],
      phoneNumber: '123-456-7890',
      province: new Province(),
      reviews: [],
      activities: [],
    };

    placeRepository.findOne.mockResolvedValue(place);

    const result = await placeService.findOneByGoogleId('1');

    expect(result).toEqual(place);
    expect(placeRepository.findOne).toHaveBeenCalledWith({ where: { googleId: '1' } });
  });

  it('returns null if place not found by googleId', async () => {
    placeRepository.findOne.mockResolvedValue(null);

    const result = await placeService.findOneByGoogleId('999');

    expect(result).toBeNull();
    expect(placeRepository.findOne).toHaveBeenCalledWith({ where: { googleId: '999' } });
  });
});
