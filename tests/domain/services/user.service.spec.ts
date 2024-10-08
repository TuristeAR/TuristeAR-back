import { UserService } from '../../../src/domain/services/user.service';
import { PublicationRepository } from '../../../src/domain/repositories/user.repository';
import { CreateUserDto } from '../../../src/application/dtos/create-user.dto';
import { User } from '../../../src/domain/entities/user';

jest.mock('../../../src/domain/repositories/user.repository');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<PublicationRepository>;

  beforeEach(() => {
    userRepository = new PublicationRepository() as jest.Mocked<PublicationRepository>;
    userService = new UserService();
    (userService as any).userRepository = userRepository;
  });

  it('creates a new user successfully', async () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      profilePicture: 'https://example.com/profile.jpg',
      googleId: '123',
    };

    await userService.create(createUserDto);

    expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
  });

  it('finds a user by Google ID successfully', async () => {
    const googleId = '123';

    const user: User = {
      birthdate: '', coverPicture: '', description: '', location: '',
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      googleId,
      profilePicture: 'https://example.com/profile.jpg',
      createdAt: new Date(),
      ownedItineraries: [],
      joinedItineraries: []
    };

    userRepository.findOne.mockResolvedValue(user);

    const result = await userService.findOneByGoogleId(googleId);

    expect(result).toEqual(user);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { googleId } });
  });

  it('returns null if no user is found by Google ID', async () => {
    const googleId = '123';

    userRepository.findOne.mockResolvedValue(null);

    const result = await userService.findOneByGoogleId(googleId);

    expect(result).toBeNull();
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { googleId } });
  });
});
