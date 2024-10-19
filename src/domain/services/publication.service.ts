import { PublicationRepository } from '../repositories/publication.repository';
import { Publication } from '../entities/publication';
import { CreatePublicationDTO } from '../../application/dtos/create-publication.dto';
import { UserRepository } from '../repositories/user.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { Category } from '../entities/category';
import { User } from '../entities/user';

export class PublicationService {
  private publicationRepository: PublicationRepository;
  private userRepository: UserRepository;
  private categoryRepository: CategoryRepository;

  constructor() {
    this.publicationRepository = new PublicationRepository();
    this.userRepository = new UserRepository();
    this.categoryRepository = new CategoryRepository();
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

  async createPublication(publicationDTO: CreatePublicationDTO, user : User): Promise<Publication> {
    const { description, images, categoryId} = publicationDTO;

    const newPublication = new Publication();
    newPublication.description = description;
    newPublication.images = images;
    newPublication.likes = [];
    newPublication.reposts = [];
    newPublication.saved = [];
    newPublication.creationDate = new Date();

    try {
      const category : Category | null = await this.categoryRepository.findOne({ where: { id: categoryId } });
      if (!category) {
        throw new Error('Categoría no encontrada');
      }
      newPublication.category = category;

      newPublication.user = user;

      return this.publicationRepository.save(newPublication);
    } catch (error) {
      console.error('Error al crear publicación:', error);
      throw error;
    }
  }

}