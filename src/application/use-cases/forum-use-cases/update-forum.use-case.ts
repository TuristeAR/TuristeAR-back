import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import { UserRepositoryInterface } from '../../../domain/repositories/user.repository.interface';
import { ForumRepositoryInterface } from '../../../domain/repositories/forum.repository.interface';
import { ForumRepository } from '../../../infrastructure/repositories/forum.repository';
import { Forum } from '../../../domain/entities/forum';

export class UpdateForumUseCase {
  private forumRepository: ForumRepositoryInterface;

  constructor() {
    this.forumRepository = new ForumRepository();
  }

  execute(forum: Forum): Promise<Forum> {
    return this.forumRepository.save(forum);
  }
}
