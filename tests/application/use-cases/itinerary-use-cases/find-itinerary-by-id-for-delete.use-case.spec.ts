import { FindItineraryByIdForDeleteUseCase } from '../../../../src/application/use-cases/itinerary-use-cases/find-itinerary-by-id-for-delete.use-case';
import { ItineraryRepositoryInterface } from '../../../../src/domain/repositories/itinerary.repository.interface';
import { Itinerary } from '../../../../src/domain/entities/itinerary';

jest.mock('../../../../src/infrastructure/repositories/itinerary.repository');

describe('FindItineraryByIdForDeleteUseCase', () => {
  let findItineraryByIdForDeleteUseCase: FindItineraryByIdForDeleteUseCase;
  let mockItineraryRepository: jest.Mocked<ItineraryRepositoryInterface>; // Mock del repositorio

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

    findItineraryByIdForDeleteUseCase = new FindItineraryByIdForDeleteUseCase();
    (findItineraryByIdForDeleteUseCase as any).itineraryRepository = mockItineraryRepository; // Asignamos el mock al caso de uso
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
      notifications: [],
      participationRequests: [],
      createdAt: new Date(),
    };

    mockItineraryRepository.findOne.mockResolvedValue(mockItinerary);

    const result = await findItineraryByIdForDeleteUseCase.execute(1);

    expect(mockItineraryRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['activities', 'user', 'forum.messages', 'events', 'expenses.userExpenses', 'notifications', 'participationRequests.notifications'],
    });

    expect(result).toEqual(mockItinerary);
  });

  it('should return null if no itinerary is found', async () => {
    mockItineraryRepository.findOne.mockResolvedValue(null);

    const result = await findItineraryByIdForDeleteUseCase.execute(999);

    expect(result).toBeNull();
  });

  it('should throw an error if there is an issue with the repository', async () => {
    mockItineraryRepository.findOne.mockRejectedValue(new Error('Repository error'));

    await expect(findItineraryByIdForDeleteUseCase.execute(1)).rejects.toThrow('Repository error');
  });
});
