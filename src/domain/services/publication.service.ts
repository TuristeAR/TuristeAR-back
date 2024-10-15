import { PublicationRepository } from '../repositories/publication.repository';
import { Publication } from '../entities/publication';
import { CreatePublicationDTO } from '../../application/dtos/create-publication.dto';

export class PublicationService {
  private publicationRepository: PublicationRepository;

  constructor() {
    this.publicationRepository = new PublicationRepository();
  }

  findByUser(id: number): Promise<Publication[] | null> {
    return this.publicationRepository.findMany({
      where: { user: { id: id } },
      relations: ['user', 'category', 'likes', 'reposts', 'saved'],
    });
  }

  findAll({}): Promise<Publication[]> {
    return this.publicationRepository.findMany({
      relations: ['user', 'category', 'likes', 'reposts', 'saved'],
      take: 10,
    });
  }

  async findByLikesUser(userId: number): Promise<Publication[] | null> {
    return this.publicationRepository.findMany({
      where: { likes: { id: userId } },
      relations: ['user', 'category', 'likes', 'reposts', 'saved'],
    });
  }

  async findByCategory(categoryId: number) {
    return this.publicationRepository.findMany({
      where: { category: { id: categoryId } },
      relations: ['user', 'category', 'likes', 'reposts', 'saved'],
    });
  }

  async findBySavedUser(userId: number) {
    return this.publicationRepository.findMany({
      where: { saved: { id: userId } },
      relations: ['user', 'category', 'likes', 'reposts', 'saved'],
    });
  }

  async createPublication(publication: CreatePublicationDTO) {
    return this.publicationRepository.create(publication);
  }
}