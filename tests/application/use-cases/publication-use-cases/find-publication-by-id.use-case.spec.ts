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
import {
  FindPublicationByIdUseCase
} from '../../../../src/application/use-cases/publication-use-cases/find-publication-by-id.use-case';
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

describe('FindPublicationsByIdUseCase', () => {
  let findPublicationByIdUseCase : FindPublicationByIdUseCase;
  let mockPublicationRepository: jest.Mocked<PublicationRepositoryInterface>;

  beforeEach(() => {
    mockPublicationRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      deleteOne: jest.fn(),
      deleteMany: jest.fn(),
    };

    findPublicationByIdUseCase = new FindPublicationByIdUseCase();
    (findPublicationByIdUseCase as any).publicationRepository = mockPublicationRepository;
  });

  it('should return an publication by id', async () => {
    mockPublicationRepository.findOne.mockResolvedValue(mockPublication);

    const result = await findPublicationByIdUseCase.execute(1);

    expect(mockPublicationRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['user', 'categories', 'likes', 'reposts', 'saved', 'comments.user', 'activities.place','notifications'],
    });

    expect(result).toEqual(mockPublication);
  })

  it('should return null if no publications is found', async () => {
    mockPublicationRepository.findOne.mockResolvedValue(null);

    const result = await findPublicationByIdUseCase.execute(10);

    expect(result).toEqual(null);
  })

  it('should throw an error if there is an issue with the repository', async () => {
    mockPublicationRepository.findOne.mockRejectedValue(new Error('Repository error'));

    await expect(findPublicationByIdUseCase.execute(1))
      .rejects
      .toThrow('Repository error');
  });

})