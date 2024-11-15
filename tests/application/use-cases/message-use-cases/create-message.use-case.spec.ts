import { User } from '../../../../src/domain/entities/user';
import { Message } from '../../../../src/domain/entities/message';
import { Category } from '../../../../src/domain/entities/category';
import { CreateMessageUseCase } from '../../../../src/application/use-cases/message-use-cases/create-message.use-case';
import { MessageRepositoryInterface } from '../../../../src/domain/repositories/message.repository.interface';
import { Forum } from '../../../../src/domain/entities/forum';
jest.mock('../../../../src/infrastructure/repositories/message.repository');


const user = new User();
user.id = 1;

const mockMessage : Message = {
  id: 1,
  createdAt: new Date(),
  content: 'Hello World',
  images: [],
  user: user,
  forum: new Forum()
}

describe('CreateMessageUseCase', () => {
  let createMessageUseCase : CreateMessageUseCase;
  let mockMessageRepository: jest.Mocked<MessageRepositoryInterface>;

  beforeEach(() => {
    mockMessageRepository = {
      findMany: jest.fn(),
      save: jest.fn(),
      deleteMany: jest.fn(),
    };

    createMessageUseCase = new CreateMessageUseCase();
    (createMessageUseCase as any).messageRepository = mockMessageRepository;
  });

  it('should create an message successfully', async () => {
    mockMessageRepository.save.mockResolvedValue(mockMessage);
    const result = await createMessageUseCase.execute(mockMessage);
    expect(mockMessageRepository.save).toHaveBeenCalledWith(mockMessage);

    expect(result).toEqual(mockMessage);
  })

  it('should throw an error if forum is invalid', async () => {
    mockMessageRepository.save.mockRejectedValue(new Error('Invalid message'));

    await expect(createMessageUseCase.execute(mockMessage)).rejects.toThrow('Invalid message');

  })

})