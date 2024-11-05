import { PublicationRepositoryInterface } from '../../../domain/repositories/publication.repository.interface';
import { PublicationRepository } from '../../../infrastructure/repositories/publication.repository';
import { DeleteResult, In } from 'typeorm';
import { Activity } from '../../../domain/entities/activity';

export class DeletePublicationsByActivitiesUseCase {
  private publicationRepository: PublicationRepositoryInterface;

  constructor() {
    this.publicationRepository = new PublicationRepository();
  }

  async execute(activities: Activity[]): Promise<DeleteResult> {
    const activityIds = activities.map(activity => activity.id);

    const publications = await this.publicationRepository.findMany({
      where: {
        activities: {
          id: In(activityIds),
        },
      },
      relations: ["activities"],
    });

    const publicationIds = publications.map(publication => publication.id);

    return this.publicationRepository.deleteMany(publicationIds);
  }



}
