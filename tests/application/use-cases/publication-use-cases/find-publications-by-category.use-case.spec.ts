import { User } from '../../../../src/domain/entities/user';
import { Publication } from '../../../../src/domain/entities/publication';
import { Category } from '../../../../src/domain/entities/category';
import {
  CreatePublicationUseCase
} from '../../../../src/application/use-cases/publication-use-cases/create-publication.use-case';
import { PublicationRepositoryInterface } from '../../../../src/domain/repositories/publication.repository.interface';
import {
  FindPublicationByCategoryUseCase
} from '../../../../src/application/use-cases/publication-use-cases/find-publication-by-category.use-case';
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

describe('FindPublicationsByCategoryUseCase', () => {
  let findPublicationByCategoryUseCase : FindPublicationByCategoryUseCase;
  let mockPublicationRepository: jest.Mocked<PublicationRepositoryInterface>;

  beforeEach(() => {
    mockPublicationRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      deleteOne: jest.fn(),
      deleteMany: jest.fn(),
    };

    findPublicationByCategoryUseCase = new FindPublicationByCategoryUseCase();
    (findPublicationByCategoryUseCase as any).publicationRepository = mockPublicationRepository;
  });

  it('should return an publications by category', async () => {
    mockPublicationRepository.findMany.mockResolvedValue([mockPublication]);

    const result = await findPublicationByCategoryUseCase.execute(1);

    expect(mockPublicationRepository.findMany).toHaveBeenCalledWith({
      where: { categories: { id: 1 } },
      relations: ['user', 'categories', 'likes', 'reposts', 'saved', 'comments', 'activities.place'],
      order: { id: 'DESC' },    });

    expect(result).toEqual([mockPublication]);
  })

  it('should return [] if no publications is found', async () => {
    mockPublicationRepository.findMany.mockResolvedValue([]);

    const result = await findPublicationByCategoryUseCase.execute(10);

    expect(result).toEqual([]);
  })

  it('should throw an error if there is an issue with the repository', async () => {
    mockPublicationRepository.findMany.mockRejectedValue(new Error('Repository error'));

    await expect(findPublicationByCategoryUseCase.execute(1))
      .rejects
      .toThrow('Repository error');
  });

})