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
import {
  FindPublicationByUserLikesUseCase
} from '../../../../src/application/use-cases/publication-use-cases/find-publication-by-user-likes.use-case';
jest.mock('../../../../src/infrastructure/repositories/notification.repository');


const user = new User();
user.id = 1;

const mockPublication : Publication = {
  id: 1,
  createdAt: new Date(),
  description: 'Foro del Estadio Monumental',
  category: new Category(),
  likes: [],
  reposts: [],
  saved: [],
  activities: [],
  comments: [],
  notifications: [],
  user: user,
}

describe('FindPublicationsByUserLikesUseCase', () => {
  let findPublicationByUserLikesUseCase : FindPublicationByUserLikesUseCase;
  let mockPublicationRepository: jest.Mocked<PublicationRepositoryInterface>;

  beforeEach(() => {
    mockPublicationRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      deleteOne: jest.fn(),
      deleteMany: jest.fn(),
    };

    findPublicationByUserLikesUseCase = new FindPublicationByUserLikesUseCase();
    (findPublicationByUserLikesUseCase as any).publicationRepository = mockPublicationRepository;
  });

  it('should return an publications by user likes', async () => {
    mockPublicationRepository.findMany.mockResolvedValue([mockPublication]);

    const result = await findPublicationByUserLikesUseCase.execute(1);

    expect(mockPublicationRepository.findMany).toHaveBeenCalledWith({
      where: { likes: { id: 1 } },
      relations: ['user', 'category', 'likes', 'reposts', 'saved', 'comments', 'activities.place'],
      order: { id: 'DESC' },
    });

    expect(result).toEqual([mockPublication]);
  })

  it('should return [] if no publications is found', async () => {
    mockPublicationRepository.findMany.mockResolvedValue([]);

    const result = await findPublicationByUserLikesUseCase.execute(10);

    expect(result).toEqual([]);
  })

  it('should throw an error if there is an issue with the repository', async () => {
    mockPublicationRepository.findMany.mockRejectedValue(new Error('Repository error'));

    await expect(findPublicationByUserLikesUseCase.execute(1))
      .rejects
      .toThrow('Repository error');
  });

})