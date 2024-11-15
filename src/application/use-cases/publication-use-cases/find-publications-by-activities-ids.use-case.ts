import { PublicationRepository } from '../../../infrastructure/repositories/publication.repository';
import { PublicationRepositoryInterface } from '../../../domain/repositories/publication.repository.interface';
import { Publication } from '../../../domain/entities/publication';
import { In } from 'typeorm';

export class FindPublicationsByActivitiesIdsUseCase {
  private publicationRepository: PublicationRepositoryInterface;

  constructor() {
    this.publicationRepository = new PublicationRepository();
  }

  execute(activityIds: number[]): Promise<Publication[]> {
    return this.publicationRepository.findMany({
      where: {
        activities: {
          id: In(activityIds),
        },
      },
      relations: ["activities", 'comments','notifications'],
    });
  }
}
