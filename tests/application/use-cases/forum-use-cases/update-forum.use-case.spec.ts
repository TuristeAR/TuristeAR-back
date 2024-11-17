import { CreateForumUseCase } from '../../../../src/application/use-cases/forum-use-cases/create-forum.use-case';
import { ForumRepositoryInterface } from '../../../../src/domain/repositories/forum.repository.interface';
import { User } from '../../../../src/domain/entities/user';
import { Forum } from '../../../../src/domain/entities/forum';
import { Category } from '../../../../src/domain/entities/category';
import { DeleteForumUseCase } from '../../../../src/application/use-cases/forum-use-cases/delete-forum.use-case';
import { DeleteResult } from 'typeorm';
import { UpdateForumUseCase } from '../../../../src/application/use-cases/forum-use-cases/update-forum.use-case';
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

describe('UpdateForumUseCase', () => {
  let updateForumUseCase : UpdateForumUseCase;
  let mockForumRepository: jest.Mocked<ForumRepositoryInterface>;

  beforeEach(() => {
    mockForumRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      deleteOne: jest.fn(),
    };

    updateForumUseCase = new UpdateForumUseCase();
    (updateForumUseCase as any).forumRepository = mockForumRepository;
  });

  it('should update forum successfully', async () => {
    mockForumRepository.save.mockResolvedValue(mockForum);

    const result = await updateForumUseCase.execute(mockForum);
    expect(result).toEqual(mockForum);
    expect(mockForumRepository.save).toHaveBeenCalledWith(mockForum);
  })

})