import { FindItineraryWithActivityUseCase } from '../../../../src/application/use-cases/itinerary-use-cases/find-itinerary-with-activity.use-case';
import { ItineraryRepositoryInterface } from '../../../../src/domain/repositories/itinerary.repository.interface';
import { Itinerary } from '../../../../src/domain/entities/itinerary';
import { Province } from '../../../../src/domain/entities/province';
import { Place } from '../../../../src/domain/entities/place';
import { Weather } from '../../../../src/domain/entities/weather';

jest.mock('../../../../src/infrastructure/repositories/itinerary.repository');

describe('FindItineraryWithActivityUseCase', () => {
  let findItineraryWithActivityUseCase: FindItineraryWithActivityUseCase;
  let mockItineraryRepository: jest.Mocked<ItineraryRepositoryInterface>;

  beforeEach(() => {
    mockItineraryRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      deleteOne: jest.fn(),
      update: jest.fn(),
      findItineraryByUserWithParticipants: jest.fn(),
    };

    findItineraryWithActivityUseCase = new FindItineraryWithActivityUseCase();
    (findItineraryWithActivityUseCase as any).itineraryRepository = mockItineraryRepository; // Asignamos el mock al caso de uso
  });

  it('should return an itinerary with activities', async () => {
    const mockProvince: Province = {
      id: 1,
      name: 'Paris Province',
      description: 'The province around Paris',
      createdAt: new Date(),
      places: [],
      georefId: '',
      weather: new Weather(),
      images: [],
      category: null,
    };

    const mockPlace: Place = {
      id: 1,
      name: 'Orale juanito',
      province: mockProvince, // Relación con Province
      googleId: 'google-id-123',
      reviews: [],
      types: [],
      address: 'Calle Rosales 231',
      locality: 'Ramos mejia',
      latitude: 48.8584,
      longitude: 2.2945,
      rating: 4.7,
      openingHours: ['9:00 AM - 6:00 PM'],
      priceLevel: 'high',
      phoneNumber: '+54 11 4658-0381',
      activities: [],
      createdAt: new Date(),
    };

    const mockItinerary: Itinerary = {
      id: 1,
      activities: [
        {
          id: 1,
          name: 'Visit Eiffel Tower',
          place: mockPlace, // Usamos el mock de Place
          fromDate: new Date(),
          toDate: new Date(),
          images: ['image1.jpg', 'image2.jpg'],
          itinerary: {} as Itinerary, // Assign an empty object of type 'Itinerary'
          createdAt: new Date(), // Add the 'createdAt' property
        },
      ],
      events: [],
      expenses: [],
      name: 'Trip to Paris',
      fromDate: new Date(),
      toDate: new Date(),
      user: {} as any,
      participants: [],
      forum: null,
      createdAt: new Date(),
    };

    mockItineraryRepository.findOne.mockResolvedValue(mockItinerary);

    const result = await findItineraryWithActivityUseCase.execute(1);

    expect(mockItineraryRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['activities', 'activities.place'],
    });

    expect(result).toEqual(mockItinerary);
  });

  it('should return null if no itinerary is found', async () => {
    mockItineraryRepository.findOne.mockResolvedValue(null);

    const result = await findItineraryWithActivityUseCase.execute(999);

    expect(result).toBeNull();
  });

  it('should throw an error if there is an issue with the repository', async () => {
    mockItineraryRepository.findOne.mockRejectedValue(new Error('Repository error'));

    await expect(findItineraryWithActivityUseCase.execute(1)).rejects.toThrow('Repository error');
  });
});
