import { User } from '../../../../src/domain/entities/user';
import { Publication } from '../../../../src/domain/entities/publication';
import { PublicationRepositoryInterface } from '../../../../src/domain/repositories/publication.repository.interface';
import { DeleteResult } from 'typeorm';
import { Activity } from '../../../../src/domain/entities/activity';
import {
  DeletePublicationsByActivitiesUseCase
} from '../../../../src/application/use-cases/publication-use-cases/delete-publications-by-activities.use-case';
import { Comment } from '../../../../src/domain/entities/comment';
import { Notification } from '../../../../src/domain/entities/notification';
jest.mock('../../../../src/infrastructure/repositories/notification.repository');


const user = new User();
user.id = 1;

const activity = new Activity();
activity.id = 1;

const notification = new Notification()
notification.id = 1;

const comment = new Comment();
comment.id = 1;

const mockPublication : Publication = {
  id: 1,
  createdAt: new Date(),
  description: 'Foro del Estadio Monumental',
  categories: [],
  likes: [],
  reposts: [],
  saved: [],
  activities: [activity],
  comments: [comment],
  notifications: [notification],
  user: user,
}

describe('DeletePublicationsByActivitiesUseCase', () => {
  let deletePublicationsByActivitiesUseCase : DeletePublicationsByActivitiesUseCase;
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

    deletePublicationsByActivitiesUseCase = new DeletePublicationsByActivitiesUseCase();
    (deletePublicationsByActivitiesUseCase as any).publicationRepository = mockPublicationRepository;
  });

  it('should delete an publication successfully', async () => {
    const deleteResult : DeleteResult = {affected: 1, raw: {}};
    mockPublicationRepository.deleteMany.mockResolvedValue(deleteResult);
    const result = await deletePublicationsByActivitiesUseCase.execute([1]);
    expect(mockPublicationRepository.deleteMany).toHaveBeenCalledWith([mockPublication.id]);
    expect(result).toEqual(deleteResult);
  })

  it('should throw an error if forum cannot be deleted', async () => {
    mockPublicationRepository.deleteMany.mockRejectedValue(new Error('Failed to delete publication'));

    await expect(deletePublicationsByActivitiesUseCase.execute([1])).rejects.toThrow('Failed to delete publication');
  })

})