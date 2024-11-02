import { CommentRepositoryInterface } from '../../../domain/repositories/comment.repository.interface';
import { CommentRepository } from '../../../infrastructure/repositories/comment.repository';
import { Comment } from '../../../domain/entities/comment';

export class FindCommentsByPublicationIdUserCase {
  private commentRepository: CommentRepositoryInterface;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  execute(publicationId: number): Promise<Comment[]> {
    return this.commentRepository.findMany({ where: {publication : {id: publicationId}} });
  }
}
