import { FindAllItineraryUseCase } from '../../../../src/application/use-cases/itinerary-use-cases/find-all-itinerary.use-case';
import { ItineraryRepositoryInterface } from '../../../../src/domain/repositories/itinerary.repository.interface';
import { Itinerary } from '../../../../src/domain/entities/itinerary';

jest.mock('../../../../src/infrastructure/repositories/itinerary.repository');

describe('FindAllItineraryUseCase', () => {
  let findAllItineraryUseCase: FindAllItineraryUseCase;
  let mockItineraryRepository: jest.Mocked<ItineraryRepositoryInterface>; // Mock del repositorio

  beforeEach(() => {
    mockItineraryRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      deleteOne: jest.fn(),
    };

    findAllItineraryUseCase = new FindAllItineraryUseCase();
    (findAllItineraryUseCase as any).itineraryRepository = mockItineraryRepository; // Asignamos el mock al caso de uso
  });

  it('should return all itineraries', async () => {
    const mockItineraries: Itinerary[] = [
      {
        id: 1,
        activities: [],
        events: [],
        expenses: [],
        name: 'Trip to Paris',
        fromDate: new Date(),
        toDate: new Date(),
        user: {} as any, 
        participants: [],
        forum: null,
        createdAt: new Date(),
      },
      {
        id: 2,
        activities: [],
        events: [],
        expenses: [],
        name: 'Trip to Tokyo',
        fromDate: new Date(),
        toDate: new Date(),
        user: {} as any,
        participants: [],
        forum: null,
        createdAt: new Date(),
      },
    ];

    mockItineraryRepository.findMany.mockResolvedValue(mockItineraries);

    const result = await findAllItineraryUseCase.execute();

    expect(mockItineraryRepository.findMany).toHaveBeenCalledWith({});

    expect(result).toEqual(mockItineraries);
  });

  it('should throw an error if itineraries cannot be fetched', async () => {
    mockItineraryRepository.findMany.mockRejectedValue(new Error('Failed to fetch itineraries'));

    await expect(findAllItineraryUseCase.execute())
      .rejects
      .toThrow('Failed to fetch itineraries');
  });
});
