import { CreatePlaceUseCase } from '../../../src/application/use-cases/place-use-cases/create-place.use-case';
import { FindAllPlaceUseCase } from '../../../src/application/use-cases/place-use-cases/find-all-place.use-case';
import { PlaceRepositoryInterface } from '../../../src/domain/repositories/place.repository.interface';
import { CreatePlaceDto } from '../../../src/infrastructure/dtos/create-place.dto';
import { Place } from '../../../src/domain/entities/place';
import { Province } from '../../../src/domain/entities/province';
import { FindPlaceByGoogleIdUseCase } from '../../../src/application/use-cases/place-use-cases/find-place-by-googleId.use-case';
import { FindPlaceByProvinceUseCase } from '../../../src/application/use-cases/place-use-cases/find-place-by-province.use-case';
import { FindPlaceByProvinceAndTypesUseCase } from '../../../src/application/use-cases/place-use-cases/find-place-by-province-and-types.use-case';

describe('PlaceUseCases', () => {
  let placeRepository: jest.Mocked<PlaceRepositoryInterface>;
  let createPlaceUseCase: CreatePlaceUseCase;
  let findAllPlaceUseCase: FindAllPlaceUseCase;
  let findPlaceByGoogleIdUseCase: FindPlaceByGoogleIdUseCase;
  let findPlaceByProvinceUseCase: FindPlaceByProvinceUseCase;
  let findPlaceByProvinceAndTypesUseCase: FindPlaceByProvinceAndTypesUseCase;

  beforeEach(() => {
    placeRepository = {
      create: jest.fn<Promise<Place>, [CreatePlaceDto]>(),
      findOne: jest.fn(),
      findMany: jest.fn(),
    } as jest.Mocked<PlaceRepositoryInterface>;
    createPlaceUseCase = new CreatePlaceUseCase();
    (createPlaceUseCase as any).placeRepository = placeRepository;
    findAllPlaceUseCase = new FindAllPlaceUseCase();
    (findAllPlaceUseCase as any).placeRepository = placeRepository;
    findPlaceByGoogleIdUseCase = new FindPlaceByGoogleIdUseCase();
    (findPlaceByGoogleIdUseCase as any).placeRepository = placeRepository;
    findPlaceByProvinceUseCase = new FindPlaceByProvinceUseCase();
    (findPlaceByProvinceUseCase as any).placeRepository = placeRepository;
    findPlaceByProvinceAndTypesUseCase = new FindPlaceByProvinceAndTypesUseCase();
    (findPlaceByProvinceAndTypesUseCase as any).placeRepository = placeRepository;
  });

  it('should create a place successfully', async () => {
    const createPlaceDto: CreatePlaceDto = {
      name: 'Test Place',
      province: new Province(),
      googleId: 'test-google-id',
      types: ['type1', 'type2'],
      address: 'Test Address',
      latitude: 1.0,
      longitude: 1.0,
      rating: 4.5,
      openingHours: ['openingHours1', 'openingHours2'],
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
      latitude: 1.0,
      longitude: 1.0,
      rating: 4.5,
      openingHours: ['openingHours1', 'openingHours2'],
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
      latitude: 1.0,
      longitude: 1.0,
      rating: 4.5,
      openingHours: ['openingHours1', 'openingHours2'],
      phoneNumber: '1234567890',
    };
    placeRepository.create.mockRejectedValue(new Error('Creation failed'));

    await expect(createPlaceUseCase.execute(createPlaceDto)).rejects.toThrow('Creation failed');
    expect(placeRepository.create).toHaveBeenCalledWith(createPlaceDto);
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
        latitude: 1.0,
        longitude: 1.0,
        rating: 4.5,
        openingHours: ['9:00 AM - 5:00 PM'],
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
        latitude: 2.0,
        longitude: 2.0,
        rating: 4.0,
        openingHours: ['10:00 AM - 6:00 PM'],
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
