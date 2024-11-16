import { User } from '../../../../src/domain/entities/user';
import { Publication } from '../../../../src/domain/entities/publication';
import { Category } from '../../../../src/domain/entities/category';
import {
  CreatePublicationUseCase
} from '../../../../src/application/use-cases/publication-use-cases/create-publication.use-case';
import { PublicationRepositoryInterface } from '../../../../src/domain/repositories/publication.repository.interface';
import {
  DeletePublicationUseCase
} from '../../../../src/application/use-cases/publication-use-cases/delete-publication.use-case';
import { DeleteResult } from 'typeorm';
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

describe('DeletePublicationUseCase', () => {
  let deletePublicationUseCase : DeletePublicationUseCase;
  let mockPublicationRepository: jest.Mocked<PublicationRepositoryInterface>;

  beforeEach(() => {
    mockPublicationRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      deleteOne: jest.fn(),
      deleteMany: jest.fn(),
    };

    deletePublicationUseCase = new DeletePublicationUseCase();
    (deletePublicationUseCase as any).publicationRepository = mockPublicationRepository;
  });

  it('should delete an publication successfully', async () => {
    const deleteResult : DeleteResult = {affected: 1, raw: {}};
    mockPublicationRepository.deleteOne.mockResolvedValue(deleteResult);
    const result = await deletePublicationUseCase.execute(mockPublication);
    expect(mockPublicationRepository.deleteOne).toHaveBeenCalledWith(mockPublication.id);
    expect(result).toEqual(deleteResult);
  })

  it('should throw an error if forum cannot be deleted', async () => {
    mockPublicationRepository.deleteOne.mockRejectedValue(new Error('Failed to delete publication'));

    await expect(deletePublicationUseCase.execute(mockPublication)).rejects.toThrow('Failed to delete publication');
  })

})