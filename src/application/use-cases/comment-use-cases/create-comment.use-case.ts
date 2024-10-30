import { CommentRepositoryInterface } from '../../../domain/repositories/comment.repository.interface';
import { CommentRepository } from '../../../infrastructure/repositories/comment.repository';
import { Comment } from '../../../domain/entities/comment';

export class CreateCommentUseCase {
  private commentRepository: CommentRepositoryInterface;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  execute(comment: Comment): Promise<Comment> {
    return this.commentRepository.save(comment);
  }
}
