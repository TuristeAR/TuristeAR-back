import { PublicationRepository } from '../../../src/domain/repositories/publication.repository';
import { User } from '../../../src/domain/entities/user';
import { PublicationService } from '../../../src/domain/services/publication.service';
import { Publication } from '../../../src/domain/entities/publication';

jest.mock('../../../src/domain/repositories/publication.repository');

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
      id: 1,
      description: 'Hola mundo',
      images: [],
      creationDate: '2018-12-09',
      createdAt: new Date(),
      user: { id: userID } as User,
    };

    publicationRepository.findForUser.mockResolvedValue([publication]);

    const result = await publicationService.findForUser(userID);

    expect(result).toEqual([publication]);
    expect(publicationRepository.findForUser).toHaveBeenCalledWith(userID);
  });


  it('if there are no posts, return null', async () => {
    const userID = 123;

    publicationRepository.findForUser.mockResolvedValue([]);

    const result = await publicationService.findForUser(userID);

    expect(result).toHaveLength(0);
  });
});
