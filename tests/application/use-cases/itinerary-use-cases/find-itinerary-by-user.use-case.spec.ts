import { FindItineraryByUserUseCase } from '../../../../src/application/use-cases/itinerary-use-cases/find-itinerary-by-user.use-case';
import { ItineraryRepositoryInterface } from '../../../../src/domain/repositories/itinerary.repository.interface';
import { Itinerary } from '../../../../src/domain/entities/itinerary';
import { User } from '../../../../src/domain/entities/user';

jest.mock('../../../../src/infrastructure/repositories/itinerary.repository');

describe('FindItineraryByUserUseCase', () => {
  let findItineraryByUserUseCase: FindItineraryByUserUseCase;
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

    findItineraryByUserUseCase = new FindItineraryByUserUseCase();
    (findItineraryByUserUseCase as any).itineraryRepository = mockItineraryRepository; // Asignamos el mock al caso de uso
  });

  it('should return itineraries for a user', async () => {
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

    // Creamos un itinerario simulado
    const mockItineraries: Itinerary[] = [
      {
        id: 1,
        activities: [],
        events: [],
        expenses: [],
        name: 'Viaje a Cordoba',
        fromDate: new Date(),
        toDate: new Date(),
        user: mockUser, // Simulamos el usuario
        participants: [],
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
        user: mockUser,
        participants: [],
        forum: null,
        createdAt: new Date(),
      },
    ];

    mockItineraryRepository.findMany.mockResolvedValue(mockItineraries);

    const result = await findItineraryByUserUseCase.execute(mockUser);

    expect(mockItineraryRepository.findMany).toHaveBeenCalledWith({
      where: { user: { id: mockUser.id } },
      relations: ['activities.place.province.category', 'activities.itinerary'],
      order: { id: 'DESC' },
    });

    expect(result).toEqual(mockItineraries);
  });

  it('should return an empty array if no itineraries are found', async () => {
    const mockUser: User = {
      id: 999,
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

    mockItineraryRepository.findMany.mockResolvedValue([]);

    const result = await findItineraryByUserUseCase.execute(mockUser);

    expect(result).toEqual([]);
  });

  it('should throw an error if there is an issue with the repository', async () => {
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

    mockItineraryRepository.findMany.mockRejectedValue(new Error('Repository error'));

    await expect(findItineraryByUserUseCase.execute(mockUser)).rejects.toThrow('Repository error');
  });
});
