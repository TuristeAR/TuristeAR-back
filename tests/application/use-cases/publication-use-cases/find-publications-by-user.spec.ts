import { User } from '../../../../src/domain/entities/user';
import { Publication } from '../../../../src/domain/entities/publication';
import { Category } from '../../../../src/domain/entities/category';
import { PublicationRepositoryInterface } from '../../../../src/domain/repositories/publication.repository.interface';
import {
  FindPublicationByCategoryUseCase
} from '../../../../src/application/use-cases/publication-use-cases/find-publication-by-category.use-case';
import {
  FindPublicationByUserUseCase
} from '../../../../src/application/use-cases/publication-use-cases/find-publication-by-user.use-case';
jest.mock('../../../../src/infrastructure/repositories/notification.repository');


const user = new User();
user.id = 1;

const mockPublication : Publication = {
  id: 1,
  createdAt: new Date(),
  description: 'Foro del Estadio Monumental',
  categories: [],
  likes: [],
  reposts: [],
  saved: [],
  activities: [],
  comments: [],
  notifications: [],
  user: user,
}

describe('FindPublicationsByUserUseCase', () => {
  let findPublicationByUserUseCase : FindPublicationByUserUseCase;
  let mockPublicationRepository: jest.Mocked<PublicationRepositoryInterface>;

  beforeEach(() => {
    mockPublicationRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      deleteOne: jest.fn(),
      deleteMany: jest.fn(),
      findPublicationsBySaved: jest.fn(),
      findPublicationsByLikes: jest.fn(),
    };

    findPublicationByUserUseCase = new FindPublicationByUserUseCase();
    (findPublicationByUserUseCase as any).publicationRepository = mockPublicationRepository;
  });

  it('should return an publications by user', async () => {
    mockPublicationRepository.findMany.mockResolvedValue([mockPublication]);

    const result = await findPublicationByUserUseCase.execute(1);

    expect(mockPublicationRepository.findMany).toHaveBeenCalledWith({
      where: [{ reposts: { id: 1 } }, { user: { id: 1 } }],
      relations: ['user', 'categories', 'likes', 'reposts', 'saved', 'comments', 'activities.place'],
      order: { id: 'DESC' },
    });

    expect(result).toEqual([mockPublication]);
  })

  it('should return [] if no publications is found', async () => {
    mockPublicationRepository.findMany.mockResolvedValue([]);

    const result = await findPublicationByUserUseCase.execute(10);

    expect(result).toEqual([]);
  })

  it('should throw an error if there is an issue with the repository', async () => {
    mockPublicationRepository.findMany.mockRejectedValue(new Error('Repository error'));

    await expect(findPublicationByUserUseCase.execute(1))
      .rejects
      .toThrow('Repository error');
  });

})