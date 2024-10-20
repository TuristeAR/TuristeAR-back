import { PublicationRepository } from '../repositories/publication.repository';
import { Publication } from '../entities/publication';
import { CreatePublicationDTO } from '../../application/dtos/create-publication.dto';
import { UserRepository } from '../repositories/user.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { Category } from '../entities/category';
import { User } from '../entities/user';
import { ForumRepository } from '../repositories/forum.repository';
import { Forum } from '../entities/forum';

export class ForumService {

  private forumRepository: ForumRepository;

  constructor() {
    this.forumRepository = new ForumRepository();
  }

  async createForums(forum : Forum){
    await this.forumRepository.save(forum);
  }

  async findAll() {
    return this.forumRepository.findMany({relations: ['place']});
  }

  async findById(id: number) {
    return this.forumRepository.findOne({
      where: { id : id },
      relations : ['place', 'messages','messages.user']
    });
  }
}