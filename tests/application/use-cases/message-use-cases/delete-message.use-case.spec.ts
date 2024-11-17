import { CreateForumUseCase } from '../../../../src/application/use-cases/forum-use-cases/create-forum.use-case';
import { ForumRepositoryInterface } from '../../../../src/domain/repositories/forum.repository.interface';
import { User } from '../../../../src/domain/entities/user';
import { Forum } from '../../../../src/domain/entities/forum';
import { Category } from '../../../../src/domain/entities/category';
import { DeleteForumUseCase } from '../../../../src/application/use-cases/forum-use-cases/delete-forum.use-case';
import { DeleteResult } from 'typeorm';
import { Message } from '../../../../src/domain/entities/message';
import { DeleteMessageUseCase } from '../../../../src/application/use-cases/message-use-cases/delete-messages.use-case';
import { MessageRepositoryInterface } from '../../../../src/domain/repositories/message.repository.interface';
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

describe('DeleteMessageUseCase', () => {
  let deleteMessageUseCase : DeleteMessageUseCase;
  let mockMessageRepository: jest.Mocked<MessageRepositoryInterface>;

  beforeEach(() => {
    mockMessageRepository = {
      findMany: jest.fn(),
      save: jest.fn(),
      deleteMany: jest.fn(),
    };

    deleteMessageUseCase = new DeleteMessageUseCase();
    (deleteMessageUseCase as any).messageRepository = mockMessageRepository;
  });

  it('should delete an message successfully', async () => {
    const deleteResult : DeleteResult = {affected: 1, raw: {}};
    mockMessageRepository.deleteMany.mockResolvedValue(deleteResult);
    const result = await deleteMessageUseCase.execute([mockMessage]);
    expect(mockMessageRepository.deleteMany).toHaveBeenCalledWith([mockMessage.id]);
    expect(result).toEqual(deleteResult);
  })

  it('should throw an error if messages cannot be deleted', async () => {
    mockMessageRepository.deleteMany.mockRejectedValue(new Error('Failed to delete messages'));

    await expect(deleteMessageUseCase.execute([mockMessage])).rejects.toThrow('Failed to delete messages');
  })

})