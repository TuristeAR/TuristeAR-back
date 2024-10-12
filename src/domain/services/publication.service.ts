import { PublicationRepository } from '../repositories/publication.repository';
import { Publication } from '../entities/publication';
import { Place } from '../entities/place';

export class PublicationService {

  private publicationRepository: PublicationRepository;

  constructor() {
    this.publicationRepository = new PublicationRepository();
  }

  findByUser(id : number): Promise<Publication[] | null> {
    return this.publicationRepository.findMany({
      where: { user:{ id : id } }
    });
  }

  findAll({}): Promise<Publication[]> {
    return this.publicationRepository.findMany({ relations: ['user'], take: 10 });
  }

  async findByLikesUser(userId : number): Promise<Publication[] | null>  {
    return this.publicationRepository.findMany({
      where : { likes: { id: userId } },
      relations: ['user']
    });
  }

  async findByCategory(categoryId: number) {
    return this.publicationRepository.findMany({
      where: { category:{ id : categoryId } }
    });
  }
}