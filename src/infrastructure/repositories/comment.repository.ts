import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { Publication } from '../../domain/entities/publication';
import { PublicationRepositoryInterface } from '../../domain/repositories/publication.repository.interface';
import { Comment } from '../../domain/entities/comment';
import { CommentRepositoryInterface } from '../../domain/repositories/comment.repository.interface';

export class CommentRepository
  extends AbstractRepository<Comment>
  implements CommentRepositoryInterface
{
  constructor() {
    super(AppDataSource.getRepository(Comment));
  }
}
