import { CreateItineraryUseCase } from '../../../../src/application/use-cases/itinerary-use-cases/create-itinerary.use-case';
import { ItineraryRepositoryInterface } from '../../../../src/domain/repositories/itinerary.repository.interface';
import { Itinerary } from '../../../../src/domain/entities/itinerary';
import { User } from '../../../../src/domain/entities/user';
import { Forum } from '../../../../src/domain/entities/forum';
import { Expense } from '../../../../src/domain/entities/expense';

jest.mock('../../../../src/infrastructure/repositories/itinerary.repository');

describe('CreateItineraryUseCase', () => {
    let createItineraryUseCase: CreateItineraryUseCase;
    let mockItineraryRepository: jest.Mocked<ItineraryRepositoryInterface>;
  
    beforeEach(() => {
        mockItineraryRepository = {
          create: jest.fn(),
          findOne: jest.fn(),
          findMany: jest.fn(),
          save: jest.fn(),
          deleteOne: jest.fn(),
        };
    
      createItineraryUseCase = new CreateItineraryUseCase();
      (createItineraryUseCase as any).itineraryRepository = mockItineraryRepository;
    });
  
    it('should create an itinerary successfully', async () => {
      const user = new User(); 
      user.id = 1;
  
      const forum = new Forum();
      forum.id = 1;
  
      const mockItinerary: Itinerary = {
        id: 1,
        activities: [],
        events: [],
        expenses: [new Expense()],
        name: 'Mi viaje',
        fromDate: new Date('2024-11-01'),
        toDate: new Date('2024-11-10'),
        user,
        participants: [user],
        forum,
        createdAt: new Date(),
      };
  
      mockItineraryRepository.create.mockResolvedValue(mockItinerary);
  
      const result = await createItineraryUseCase.execute(mockItinerary);
  
      expect(mockItineraryRepository.create).toHaveBeenCalledWith(mockItinerary);
  
      expect(result).toEqual(mockItinerary);
    });
  
    it('should throw an error if itinerary is invalid', async () => {
      mockItineraryRepository.create.mockRejectedValue(new Error('Invalid itinerary'));
  
      const invalidItinerary: Itinerary = {
        id: 0,
        activities: [],
        events: [],
        expenses: [],
        name: '',
        fromDate: new Date(),
        toDate: new Date(),
        user: {} as User,  
        participants: [],
        forum: null,
        createdAt: new Date(),
      };
  
      await expect(createItineraryUseCase.execute(invalidItinerary))
        .rejects
        .toThrow('Invalid itinerary');
    });
  });