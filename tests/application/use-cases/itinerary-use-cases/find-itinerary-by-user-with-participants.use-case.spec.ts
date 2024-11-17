import { FindItineraryByUserWithParticipantsUseCase } from '../../../../src/application/use-cases/itinerary-use-cases/find-itinerary-by-user-with-participants.use-case';
import { ItineraryRepositoryInterface } from '../../../../src/domain/repositories/itinerary.repository.interface';
import { Itinerary } from '../../../../src/domain/entities/itinerary';
import { User } from '../../../../src/domain/entities/user';

jest.mock('../../../../src/infrastructure/repositories/itinerary.repository');

describe('FindItineraryByUserWithParticipantsUseCase', () => {
  let findItineraryByUserWithParticipantsUseCase: FindItineraryByUserWithParticipantsUseCase;
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

    findItineraryByUserWithParticipantsUseCase = new FindItineraryByUserWithParticipantsUseCase();
    (findItineraryByUserWithParticipantsUseCase as any).itineraryRepository =
      mockItineraryRepository;
  });

  it('should return itineraries for a user with participants', async () => {
    const mockUser: User = {
      id: 1,
      email: 'user@example.com',
      name: 'Lucas Rodriguez',
      profilePicture: 'profile.jpg',
      coverPicture: 'cover.jpg',
      location: 'Buenos Aires',
      birthdate: new Date(1990, 1, 1),
      googleId: 'google-id-123',
      description: 'Traveler',
      createdAt: new Date(),
      ownedItineraries: [],
      joinedItineraries: [],
    };

    const mockItineraries: Itinerary[] = [
      {
        id: 1,
        activities: [],
        events: [],
        expenses: [],
        name: 'Viaje a Buenos Aires',
        fromDate: new Date(),
        toDate: new Date(),
        user: {} as any,
        participants: [mockUser],
        forum: null,
        createdAt: new Date(),
      },
      {
        id: 2,
        activities: [],
        events: [],
        expenses: [],
        name: 'Viaje a Mendoza',
        fromDate: new Date(),
        toDate: new Date(),
        user: {} as any,
        participants: [mockUser],
        forum: null,
        createdAt: new Date(),
      },
    ];

    mockItineraryRepository.findItineraryByUserWithParticipants.mockResolvedValue(mockItineraries);

    const result = await findItineraryByUserWithParticipantsUseCase.execute(1);

    expect(mockItineraryRepository.findItineraryByUserWithParticipants).toHaveBeenCalledWith(1);

    expect(result).toEqual(mockItineraries);
  });

  it('should return an empty array if no itineraries are found', async () => {
    mockItineraryRepository.findItineraryByUserWithParticipants.mockResolvedValue([]);

    const result = await findItineraryByUserWithParticipantsUseCase.execute(999);

    expect(result).toEqual([]);
  });

  it('should throw an error if there is an issue with the repository', async () => {
    mockItineraryRepository.findItineraryByUserWithParticipants.mockRejectedValue(new Error('Repository error'));

    await expect(findItineraryByUserWithParticipantsUseCase.execute(1)).rejects.toThrow(
      'Repository error',
    );
  });
});
