import { CreateCommentUseCase } from '../../../../src/application/use-cases/comment-use-cases/create-comment.use-case';
import { CommentRepositoryInterface } from '../../../../src/domain/repositories/comment.repository.interface';
import { Comment } from '../../../../src/domain/entities/comment';
import { User } from '../../../../src/domain/entities/user';
import { Publication } from '../../../../src/domain/entities/publication';

describe('CreateCommentUseCase', () => {
  let createCommentUseCase: CreateCommentUseCase;
  let mockCommentRepository: jest.Mocked<CommentRepositoryInterface>;

  beforeEach(() => {
    mockCommentRepository = {
      save: jest.fn(),
      deleteMany: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
    };
    createCommentUseCase = new CreateCommentUseCase();
    (createCommentUseCase as any).commentRepository = mockCommentRepository;
  });

  it('should create a comment successfully', async () => {
    const comment: Comment = {
      id: 1,
      description: 'Test comment',
      user: new User(),
      publication: new Publication(),
      createdAt: new Date(),
    };
    mockCommentRepository.save.mockResolvedValue(comment);

    const result = await createCommentUseCase.execute(comment);

    expect(result).toEqual(comment);
    expect(mockCommentRepository.save).toHaveBeenCalledWith(comment);
  });

  it('should throw an error if comment is invalid', async () => {
    const comment: Comment = {
      id: 1,
      description: 'Test comment',
      user: new User(),
      publication: new Publication(),
      createdAt: new Date(),
    };
    mockCommentRepository.save.mockRejectedValue(new Error('Invalid comment'));

    await expect(createCommentUseCase.execute(comment)).rejects.toThrow('Invalid comment');
  });
});
