import { ForumRepository } from '../../../infrastructure/repositories/forum.repository';
import { ForumRepositoryInterface } from '../../../domain/repositories/forum.repository.interface';
import { Forum } from '../../../domain/entities/forum';

export class FindAllForumUseCase {
  private forumRepository: ForumRepositoryInterface;

  constructor() {
    this.forumRepository = new ForumRepository();
  }

  execute(): Promise<Forum[]> {
    return this.forumRepository.findMany({
      relations: ['category'],
      where: { isPublic: true },
      order: { id: 'DESC' },
    });
  }
}
