import { Forum } from '../../../domain/entities/forum';
import { ForumRepository } from '../../../infrastructure/repositories/forum.repository';
import { ForumRepositoryInterface } from '../../../domain/repositories/forum.repository.interface';

export class CreateForumUseCase {
  private forumRepository: ForumRepositoryInterface;

  constructor() {
    this.forumRepository = new ForumRepository();
  }

  execute(forum: Forum): Promise<Forum> {
    return this.forumRepository.save(forum);
  }
}
