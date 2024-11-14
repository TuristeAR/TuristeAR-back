import { FindItineraryByIdUseCase } from '../../../../src/application/use-cases/itinerary-use-cases/find-itinerary-by-id.use-case';
import { ItineraryRepositoryInterface } from '../../../../src/domain/repositories/itinerary.repository.interface';
import { Itinerary } from '../../../../src/domain/entities/itinerary';

jest.mock('../../../../src/infrastructure/repositories/itinerary.repository');

describe('FindItineraryByIdUseCase', () => {
  let findItineraryByIdUseCase: FindItineraryByIdUseCase;
  let mockItineraryRepository: jest.Mocked<ItineraryRepositoryInterface>; 

  beforeEach(() => {
    mockItineraryRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      deleteOne: jest.fn(),
    };

    findItineraryByIdUseCase = new FindItineraryByIdUseCase();
    (findItineraryByIdUseCase as any).itineraryRepository = mockItineraryRepository; 
  });

  it('should return an itinerary by id', async () => {
    const mockItinerary: Itinerary = {
      id: 1,
      activities: [],
      events: [],
      expenses: [],
      name: 'Viaje a Buenos Aires',
      fromDate: new Date(),
      toDate: new Date(),
      user: {} as any,
      participants: [],
      forum: null,
      createdAt: new Date(),
    };

    mockItineraryRepository.findOne.mockResolvedValue(mockItinerary);

    const result = await findItineraryByIdUseCase.execute(1);

    expect(mockItineraryRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['user', 'activities.place.province', 'events.province', 'forum.messages.user'],
    });

    expect(result).toEqual(mockItinerary);
  });

  it('should return null if no itinerary is found', async () => {
    mockItineraryRepository.findOne.mockResolvedValue(null);

    const result = await findItineraryByIdUseCase.execute(999);

    expect(result).toBeNull();
  });

  it('should throw an error if there is an issue with the repository', async () => {
    mockItineraryRepository.findOne.mockRejectedValue(new Error('Repository error'));

    await expect(findItineraryByIdUseCase.execute(1))
      .rejects
      .toThrow('Repository error');
  });
});
