import { PublicationRepositoryInterface } from '../../../domain/repositories/publication.repository.interface';
import { PublicationRepository } from '../../../infrastructure/repositories/publication.repository';
import { DeleteResult, In } from 'typeorm';
import { Activity } from '../../../domain/entities/activity';
import { FindCommentsByPublicationIdUserCase } from '../comment-use-cases/find-comments-by-publication-id.user-case';
import { DeleteCommentsUseCase } from '../comment-use-cases/delete-comments.use-case';
import { DeleteNotificationByIdUseCase } from '../notification-use-cases/delete-notification-by-id.use-case';

export class DeletePublicationsByActivitiesUseCase {
  private publicationRepository: PublicationRepositoryInterface;

  constructor() {
    this.publicationRepository = new PublicationRepository();
  }

  async execute(activities: Activity[]): Promise<DeleteResult | null> {
    const activityIds = activities.map(activity => activity.id);

    const publications = await this.publicationRepository.findMany({
      where: {
        activities: {
          id: In(activityIds),
        },
      },
      relations: ["activities", 'comments','notifications'],
    });

    for (const publication of publications) {
      if (publication.comments.length > 0) {
        const deleteCommentsUseCase = new DeleteCommentsUseCase();
        await deleteCommentsUseCase.execute(publication.comments);
      }

      if(publication.notifications.length > 0) {
        for (const notification of publication.notifications) {
          const deleteNotificationByIdUseCase = new DeleteNotificationByIdUseCase();
          await deleteNotificationByIdUseCase.execute(notification.id);
        }
      }
    }

    const publicationIds = publications.map(publication => publication.id);

    return publicationIds.length > 0 ? this.publicationRepository.deleteMany(publicationIds) : null;
  }



}
