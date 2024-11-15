import { CreateForumUseCase } from '../../../../src/application/use-cases/forum-use-cases/create-forum.use-case';
import { ForumRepositoryInterface } from '../../../../src/domain/repositories/forum.repository.interface';
import { User } from '../../../../src/domain/entities/user';
import { Forum } from '../../../../src/domain/entities/forum';
import { Category } from '../../../../src/domain/entities/category';
import { DeleteForumUseCase } from '../../../../src/application/use-cases/forum-use-cases/delete-forum.use-case';
import { DeleteResult } from 'typeorm';
jest.mock('../../../../src/infrastructure/repositories/forum.repository');


const user = new User();
user.id = 1;

const category = new Category();
category.id = 1;

const mockForum : Forum = {
  id: 1,
  createdAt: new Date(),
  name: 'El monumental',
  description: 'Foro del Estadio Monumental',
  messages: [],
  category: category,
  user: user,
  isPublic: true
}

describe('DeleteForumUseCase', () => {
  let deleteForumUseCase : DeleteForumUseCase;
  let mockForumRepository: jest.Mocked<ForumRepositoryInterface>;

  beforeEach(() => {
    mockForumRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      deleteOne: jest.fn(),
    };

    deleteForumUseCase = new DeleteForumUseCase();
    (deleteForumUseCase as any).forumRepository = mockForumRepository;
  });

  it('should delete an forum successfully', async () => {
    const deleteResult : DeleteResult = {affected: 1, raw: {}};
    mockForumRepository.deleteOne.mockResolvedValue(deleteResult);
    const result = await deleteForumUseCase.execute(mockForum);
    expect(mockForumRepository.deleteOne).toHaveBeenCalledWith(mockForum.id);
    expect(result).toEqual(deleteResult);
  })

  it('should throw an error if forum cannot be deleted', async () => {
    mockForumRepository.deleteOne.mockRejectedValue(new Error('Failed to delete forum'));

    await expect(deleteForumUseCase.execute(mockForum)).rejects.toThrow('Failed to delete forum');
  })

})