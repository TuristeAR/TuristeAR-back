import { CreateForumUseCase } from '../../../../src/application/use-cases/forum-use-cases/create-forum.use-case';
import { ForumRepositoryInterface } from '../../../../src/domain/repositories/forum.repository.interface';
import { User } from '../../../../src/domain/entities/user';
import { Forum } from '../../../../src/domain/entities/forum';
import { Category } from '../../../../src/domain/entities/category';
import { FindForumByIdUseCase } from '../../../../src/application/use-cases/forum-use-cases/find-forum-by-id.use-case';
import { Message } from '../../../../src/domain/entities/message';
jest.mock('../../../../src/infrastructure/repositories/forum.repository');


const user = new User();
user.id = 1;

const category = new Category();
category.id = 1;

const message = new Message();
message.id = 1;
message.user = user;

const mockForum : Forum = {
  id: 1,
  createdAt: new Date(),
  name: 'El monumental',
  description: 'Foro del Estadio Monumental',
  messages: [message],
  category: category,
  user: user,
  isPublic: true
}

describe('FindForumByIdUseCase', () => {
  let findForumByIdUseCase : FindForumByIdUseCase;
  let mockForumRepository: jest.Mocked<ForumRepositoryInterface>;

  beforeEach(() => {
    mockForumRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      deleteOne: jest.fn(),
    };

    findForumByIdUseCase = new FindForumByIdUseCase();
    (findForumByIdUseCase as any).forumRepository = mockForumRepository;
  });

  it('should return an forum by id', async () => {
    mockForumRepository.findOne.mockResolvedValue(mockForum);

    const result = await findForumByIdUseCase.execute(1);

    expect(mockForumRepository.findOne).toHaveBeenCalledWith({
      where: { id : 1 },
      relations: ['category','messages', 'messages.user']
    });

    expect(result).toEqual(mockForum);
  })

  it('should return null if no forum is found', async () => {
    mockForumRepository.findOne.mockResolvedValue(null);

    const result = await findForumByIdUseCase.execute(10);

    expect(result).toBeNull();
  })

  it('should throw an error if there is an issue with the repository', async () => {
    mockForumRepository.findOne.mockRejectedValue(new Error('Repository error'));

    await expect(findForumByIdUseCase.execute(1))
      .rejects
      .toThrow('Repository error');
  });

})