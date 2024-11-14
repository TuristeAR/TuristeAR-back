import { User } from '../../../../src/domain/entities/user';
import { Publication } from '../../../../src/domain/entities/publication';
import { DeleteCommentsUseCase } from '../../../../src/application/use-cases/comment-use-cases/delete-comments.use-case';
import { CommentRepositoryInterface } from '../../../../src/domain/repositories/comment.repository.interface';
import { Comment } from '../../../../src/domain/entities/comment';
import { DeleteResult } from 'typeorm';

describe('DeleteCommentsUseCase', () => {
  let deleteCommentsUseCase: DeleteCommentsUseCase;
  let mockCommentRepository: jest.Mocked<CommentRepositoryInterface>;

  beforeEach(() => {
    mockCommentRepository = {
      save: jest.fn(),
      deleteMany: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
    };
    deleteCommentsUseCase = new DeleteCommentsUseCase();
    (deleteCommentsUseCase as any).commentRepository = mockCommentRepository;
  });

  it('should delete comments successfully', async () => {
    const comments: Comment[] = [
      {
        id: 1,
        description: 'Test comment',
        user: new User(),
        publication: new Publication(),
        createdAt: new Date(),
      },
    ];
    const deleteResult: DeleteResult = { affected: 1, raw: [] };
    mockCommentRepository.deleteMany.mockResolvedValue(deleteResult);

    const result = await deleteCommentsUseCase.execute(comments);

    expect(result).toEqual(deleteResult);
    expect(mockCommentRepository.deleteMany).toHaveBeenCalledWith([1]);
  });

  it('should throw an error if comments array is empty', async () => {
    const comments: Comment[] = [];
    mockCommentRepository.deleteMany.mockRejectedValue(new Error('No comments to delete'));

    await expect(deleteCommentsUseCase.execute(comments)).rejects.toThrow('No comments to delete');
  });
});
