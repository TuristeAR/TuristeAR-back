import { PublicationRepository } from '../repositories/publication.repository';
import { Publication } from '../entities/publication';
import { Place } from '../entities/place';

export class PublicationService {

  private publicationRepository: PublicationRepository;

  constructor() {
    this.publicationRepository = new PublicationRepository();
  }

  findForUser(id : number): Promise<Publication[] | null> {
    return this.publicationRepository.findMany({
      where: {
        user:{
          id : id
        }
      }
    });

  }

  findAll({}): Promise<Publication[]> {
    return this.publicationRepository.findMany({ relations: ['user'], take: 10 });
  }

}