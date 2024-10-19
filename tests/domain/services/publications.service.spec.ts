import { PublicationRepository } from '../../../src/domain/repositories/publication.repository';
import { User } from '../../../src/domain/entities/user';
import { PublicationService } from '../../../src/domain/services/publication.service';
import { Publication } from '../../../src/domain/entities/publication';
import { Category } from '../../../src/domain/entities/category';

jest.mock('../../../src/domain/repositories/publication.repository');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('PublicationService', () => {
  let publicationService: PublicationService;
  let publicationRepository: jest.Mocked<PublicationRepository>;

  beforeEach(() => {
    publicationRepository = new PublicationRepository() as jest.Mocked<PublicationRepository>;
    publicationService = new PublicationService();
    (publicationService as any).publicationRepository = publicationRepository;
  });

  it('should find publications by user id', async () => {
    const userID = 1;

    const publication: Publication = {
      reposts: [],
      saved: [],
      likes: [],
      id: 1,
      category: new Category(),
      description: 'Hola mundo',
      images: [],
      creationDate: new Date(),
      createdAt: new Date(),
      user: { id: userID } as User,
    };

    publicationRepository.findMany.mockResolvedValue([publication]);

    const result = await publicationService.findByUser(userID);

    expect(result).toEqual([publication]);
  });

  it('if there are no posts, return null', async () => {
    const userID = 123;

    publicationRepository.findMany.mockResolvedValue([]);

    const result = await publicationService.findByUser(userID);

    expect(result).toHaveLength(0);
  });

  it('should find publications by likes of users', async () => {
    const publication: Publication = {
      reposts: [],
      saved: [],
      likes: [{ id: 1 } as User],
      id: 1,
      category: new Category(),
      description: 'Hola mundo',
      images: [],
      creationDate: new Date(),
      createdAt: new Date(),
      user: { id: 1 } as User,
    };

    publicationRepository.findMany.mockResolvedValue([publication]);

    const result = await publicationService.findByLikesUser(1);

    expect(result).toHaveLength(1);
  });
});
