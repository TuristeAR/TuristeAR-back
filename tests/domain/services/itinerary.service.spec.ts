import { ItineraryService } from '../../../src/domain/services/itinerary.service';
import { UserService } from '../../../src/domain/services/user.service';
import { ItineraryRepository } from '../../../src/domain/repositories/itinerary.repository';
import { Itinerary } from '../../../src/domain/entities/itinerary';
import { User } from '../../../src/domain/entities/user';
import { Activity } from '../../../src/domain/entities/activity';


jest.mock('../repositories/itinerary.repository');
jest.mock('../services/user.service');

describe('ItineraryService - addUserToItinerary', () => {
  let itineraryService: ItineraryService;
  let itineraryRepository: jest.Mocked<ItineraryRepository>;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    itineraryRepository = new ItineraryRepository() as jest.Mocked<ItineraryRepository>;
    userService = new UserService() as jest.Mocked<UserService>;
    itineraryService = new ItineraryService();
  });

  it('should throw an error if the itinerary is not found', async () => {
    itineraryRepository.findOne.mockResolvedValue(null);

    await expect(itineraryService.addUserToItinerary(1, 1)).rejects.toThrow('Itinerary not found');
    expect(itineraryRepository.findOne).toHaveBeenCalledWith(1, { relations: ['participants'] });
  });

  it('should throw an error if the user is the owner of the itinerary', async () => {
    const owner = { id: 1 } as User;
    const itinerary: Itinerary = {
        id: 1,
        user: { id: 2 } as User,
        participants: [],
        activities: [] as Activity[],
        fromDate: new Date(),
        toDate: new Date(),
        createdAt: new Date()
      };
    itineraryRepository.findOne.mockResolvedValue(itinerary);

    await expect(itineraryService.addUserToItinerary(1, 1)).rejects.toThrow('Owner cannot be added as a participant');
  });

  it('should throw an error if the user is not found', async () => {
    const itinerary: Itinerary = {
        id: 1,
        user: { id: 2 } as User,
        participants: [],
        activities: [] as Activity[],
        fromDate: new Date(),
        toDate: new Date(),
        createdAt: new Date()
      };
    itineraryRepository.findOne.mockResolvedValue(itinerary);
    userService.findOneById.mockResolvedValue(null);

    await expect(itineraryService.addUserToItinerary(1, 999)).rejects.toThrow('User not found');
    expect(userService.findOneById).toHaveBeenCalledWith(999);
  });

  it('should not add the user if they are already a participant', async () => {
    const user = { id: 3 } as User;
    const itinerary = { id: 1, user: { id: 2 }, participants: [user] } as Itinerary;

    itineraryRepository.findOne.mockResolvedValue(itinerary);
    userService.findOneById.mockResolvedValue(user);

    const result = await itineraryService.addUserToItinerary(1, 3);

    expect(result).toEqual(itinerary); // Itinerary remains the same
    expect(itineraryRepository.save).not.toHaveBeenCalled(); // No save since user is already a participant
  });

  it('should add the user to the itinerary and save it', async () => {
    const user = { id: 3 } as User;
    const itinerary: Itinerary = {
        id: 1,
        user: { id: 2 } as User,
        participants: [],
        activities: [] as Activity[],
        fromDate: new Date(),
        toDate: new Date(),
        createdAt: new Date()
      };
    itineraryRepository.findOne.mockResolvedValue(itinerary);
    userService.findOneById.mockResolvedValue(user);
    itineraryRepository.save.mockResolvedValue(itinerary);

    const result = await itineraryService.addUserToItinerary(1, 3);

    expect(result).toEqual(itinerary); // Ensure the returned itinerary is correct
    expect(itinerary.participants).toContain(user); // Ensure the user was added to participants
    expect(itineraryRepository.save).toHaveBeenCalledWith(itinerary); // Ensure the itinerary was saved
  });
});
