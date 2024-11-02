import { PublicationRepositoryInterface } from '../../../domain/repositories/publication.repository.interface';
import { Publication } from '../../../domain/entities/publication';
import { PublicationRepository } from '../../../infrastructure/repositories/publication.repository';
import { DeleteResult } from 'typeorm';
import { ForumRepositoryInterface } from '../../../domain/repositories/forum.repository.interface';
import { ForumRepository } from '../../../infrastructure/repositories/forum.repository';
import { Forum } from '../../../domain/entities/forum';

export class DeleteForumUseCase {
  private forumRepository: ForumRepositoryInterface;

  constructor() {
    this.forumRepository = new ForumRepository();
  }

  execute(forum: Forum): Promise<DeleteResult> {
    return this.forumRepository.deleteOne(forum.id);
  }
}
