import { ForumRepositoryInterface } from '../../../../src/domain/repositories/forum.repository.interface';
import { User } from '../../../../src/domain/entities/user';
import { Forum } from '../../../../src/domain/entities/forum';
import { Category } from '../../../../src/domain/entities/category';
import { FindForumByIdUseCase } from '../../../../src/application/use-cases/forum-use-cases/find-forum-by-id.use-case';
import { Message } from '../../../../src/domain/entities/message';
import { FindAllForumUseCase } from '../../../../src/application/use-cases/forum-use-cases/find-all-forum.use-case';
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
const mockForumDos : Forum = {
  id: 2,
  createdAt: new Date(),
  name: 'Museo de River',
  description: 'Foro del Museo de River',
  messages: [message],
  category: category,
  user: user,
  isPublic: true
}

const mockForums = [
  mockForum,
  mockForumDos,
]

describe('FindAllForumsUseCase', () => {
  let findAllForumUseCase : FindAllForumUseCase;
  let mockForumRepository: jest.Mocked<ForumRepositoryInterface>;

  beforeEach(() => {
    mockForumRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      deleteOne: jest.fn(),
    };

    findAllForumUseCase = new FindAllForumUseCase();
    (findAllForumUseCase as any).forumRepository = mockForumRepository;
  });

  it('should return all forums', async () => {
    mockForumRepository.findMany.mockResolvedValue(mockForums);

    const result = await findAllForumUseCase.execute();

    expect(mockForumRepository.findMany).toHaveBeenCalledWith({
      relations: ['category', 'user', 'messages'],
      where: { isPublic: true },
      order: {id : 'DESC'}
    });

    expect(result).toEqual(mockForums);
  })

  it('should throw an error if forums cannot be fetched', async () => {
    mockForumRepository.findMany.mockRejectedValue(new Error('Failed to fetch forums'));
    await expect(findAllForumUseCase.execute()).rejects.toThrow('Failed to fetch forums')
  })
})