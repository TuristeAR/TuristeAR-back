import { ForumRepository } from '../../../infrastructure/repositories/forum.repository';
import { ForumRepositoryInterface } from '../../../domain/repositories/forum.repository.interface';
import { Forum } from '../../../domain/entities/forum';

export class FindForumByIdForDeleteUseCase {
  private forumRepository: ForumRepositoryInterface;

  constructor() {
    this.forumRepository = new ForumRepository();
  }

  execute(id: number): Promise<Forum | null> {
    return this.forumRepository.findOne({
      where: { itinerary: { id: id } },
      relations: ['messages'],
    });
  }
}
