import { CommentRepositoryInterface } from '../../../domain/repositories/comment.repository.interface';
import { CommentRepository } from '../../../infrastructure/repositories/comment.repository';
import { Comment } from '../../../domain/entities/comment';
import { DeleteResult } from 'typeorm';

export class DeleteCommentsUseCase {
  private commentRepository: CommentRepositoryInterface;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  execute(comments: Comment[]): Promise<DeleteResult> {
    return this.commentRepository.deleteMany(comments.map(comment => comment.id));
  }
}
