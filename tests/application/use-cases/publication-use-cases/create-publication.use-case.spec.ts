import { User } from '../../../../src/domain/entities/user';
import { Publication } from '../../../../src/domain/entities/publication';
import { Category } from '../../../../src/domain/entities/category';
import {
  CreatePublicationUseCase
} from '../../../../src/application/use-cases/publication-use-cases/create-publication.use-case';
import { PublicationRepositoryInterface } from '../../../../src/domain/repositories/publication.repository.interface';
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

describe('CreatePublicationUseCase', () => {
  let createPublicationUseCase : CreatePublicationUseCase;
  let mockPublicationRepository: jest.Mocked<PublicationRepositoryInterface>;

  beforeEach(() => {
    mockPublicationRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      deleteOne: jest.fn(),
      deleteMany: jest.fn(),
    };

    createPublicationUseCase = new CreatePublicationUseCase();
    (createPublicationUseCase as any).publicationRepository = mockPublicationRepository;
  });

  it('should create an publication successfully', async () => {
    mockPublicationRepository.save.mockResolvedValue(mockPublication);
    const result = await createPublicationUseCase.execute(mockPublication);
    expect(mockPublicationRepository.save).toHaveBeenCalledWith(mockPublication);

    expect(result).toEqual(mockPublication);
  })

  it('should throw an error if publication is invalid', async () => {
    mockPublicationRepository.save.mockRejectedValue(new Error('Invalid publication'));

    await expect(createPublicationUseCase.execute(mockPublication)).rejects.toThrow('Invalid publication');

  })

})