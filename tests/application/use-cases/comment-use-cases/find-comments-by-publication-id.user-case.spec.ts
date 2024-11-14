import { FindCommentsByPublicationIdUserCase } from '../../../../src/application/use-cases/comment-use-cases/find-comments-by-publication-id.user-case';
import { CommentRepositoryInterface } from '../../../../src/domain/repositories/comment.repository.interface';
import { Comment } from '../../../../src/domain/entities/comment';
import { User } from '../../../../src/domain/entities/user';
import { Publication } from '../../../../src/domain/entities/publication';

describe('FindCommentsByPublicationIdUserCase', () => {
  let findCommentsByPublicationIdUserCase: FindCommentsByPublicationIdUserCase;
  let mockCommentRepository: jest.Mocked<CommentRepositoryInterface>;

  beforeEach(() => {
    mockCommentRepository = {
      save: jest.fn(),
      deleteMany: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
    } as jest.Mocked<CommentRepositoryInterface>;
    findCommentsByPublicationIdUserCase = new FindCommentsByPublicationIdUserCase();
    (findCommentsByPublicationIdUserCase as any).commentRepository = mockCommentRepository;
  });

  it('returns comments for a valid publication ID', async () => {
    const publicationId = 1;
    const comments: Comment[] = [
      {
        id: 1,
        description: 'Test comment',
        user: new User(),
        publication: new Publication(),
        createdAt: new Date(),
      },
    ];
    mockCommentRepository.findMany.mockResolvedValue(comments);

    const result = await findCommentsByPublicationIdUserCase.execute(publicationId);

    expect(result).toEqual(comments);
    expect(mockCommentRepository.findMany).toHaveBeenCalledWith({
      where: { publication: { id: publicationId } },
    });
  });

  it('returns an empty array if no comments are found', async () => {
    const publicationId = 2;
    mockCommentRepository.findMany.mockResolvedValue([]);

    const result = await findCommentsByPublicationIdUserCase.execute(publicationId);

    expect(result).toEqual([]);
    expect(mockCommentRepository.findMany).toHaveBeenCalledWith({
      where: { publication: { id: publicationId } },
    });
  });
});
