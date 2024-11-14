import { CreateForumUseCase } from '../../../../src/application/use-cases/forum-use-cases/create-forum.use-case';
import { ForumRepositoryInterface } from '../../../../src/domain/repositories/forum.repository.interface';
import { User } from '../../../../src/domain/entities/user';
import { Forum } from '../../../../src/domain/entities/forum';
import { Category } from '../../../../src/domain/entities/category';
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

describe('CreateForumUseCase', () => {
  let createForumUseCase : CreateForumUseCase;
  let mockForumRepository: jest.Mocked<ForumRepositoryInterface>;

  beforeEach(() => {
    mockForumRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      deleteOne: jest.fn(),
    };

    createForumUseCase = new CreateForumUseCase();
    (createForumUseCase as any).forumRepository = mockForumRepository;
  });

  it('should create an forum successfully', async () => {
    mockForumRepository.save.mockResolvedValue(mockForum);
    const result = await createForumUseCase.execute(mockForum);
    expect(mockForumRepository.save).toHaveBeenCalledWith(mockForum);

    expect(result).toEqual(mockForum);
  })

  it('should throw an error if forum is invalid', async () => {
    mockForumRepository.save.mockRejectedValue(new Error('Invalid forum'));

    await expect(createForumUseCase.execute(mockForum)).rejects.toThrow('Invalid forum');

  })

})