import { Publication } from '../entities/publication';
import { CreatePublicationDTO } from '../../infrastructure/dtos/create-publication.dto';
import { User } from '../entities/user';
import { CreatePublicationUseCase } from '../../application/use-cases/publication-use-cases/create-publication.use-case';
import { FindCategoryByIdUseCase } from '../../application/use-cases/category-use-cases/find-category-by-id.use-case';
import { UpdatePublicationUseCase } from '../../application/use-cases/publication-use-cases/update-publication.use-case';
import { FindActivityByIdUseCase } from '../../application/use-cases/activity-use-cases/find-activity-by-id.use-case';
import { Activity } from '../entities/activity';
import { Notification } from '../entities/notification';
import {
  CreateNotificationUseCase
} from '../../application/use-cases/notification-use-cases/create-notification.use-case';
import {
  FindNotificationByPublicationIdAndTypeUseCase
} from '../../application/use-cases/notification-use-cases/find-notification-by-publication-id-and-type.use-case';
import {
  UpdateNotificationUseCase
} from '../../application/use-cases/notification-use-cases/update-notification.use-case';
import {
  DeleteNotificationByIdUseCase
} from '../../application/use-cases/notification-use-cases/delete-notification-by-id.use-case';

export class PublicationService {
  async createPublication(publicationDTO: CreatePublicationDTO, user: User): Promise<Publication> {
    const { description, activities } = publicationDTO;

    const newPublication = new Publication();

    newPublication.description = description;
    newPublication.likes = [];
    newPublication.reposts = [];
    newPublication.saved = [];

    try {
      const findCategoryByIdUseCase = new FindCategoryByIdUseCase();
      const findActivityByIdUseCase = new FindActivityByIdUseCase();

      if(!activities) {
        throw new Error('Actividades vacías');
      }

      const activityEntities = [] as Activity[];

      for (const activity of activities) {
        const activityEntity = await findActivityByIdUseCase.execute(activity);
        if (activityEntity instanceof Activity) {
          activityEntities.push(activityEntity);
        }
      }

      const category = await findCategoryByIdUseCase.execute(
        Number(activityEntities[0].place.province.category?.id),
      );

      if (!category) {
        throw new Error('Categoría no encontrada');
      }

      newPublication.category = category;
      newPublication.activities = activityEntities;
      newPublication.user = user;

      const createPublicationUseCase = new CreatePublicationUseCase();

      return createPublicationUseCase.execute(newPublication);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async handleLike(publication: Publication | null, user: User) {
    if (!publication) {
      throw new Error('La publicación es nula o no se encontró.');
    }

    const userAlreadyLiked = publication.likes.some((likedUser) => likedUser.id === user.id);

    const findNotificationByPublicationIdUseCase = new FindNotificationByPublicationIdAndTypeUseCase();
    const deleteNotificationByIdUseCase = new DeleteNotificationByIdUseCase();
    const updateNotificationUseCase = new UpdateNotificationUseCase();
    const existingNotification = await findNotificationByPublicationIdUseCase.execute(publication.id, 'me gusta');

    const getNotificationDescription = () => {
      const topLikesNames = publication.likes.slice(0, 3).map((likedUser) => likedUser.name);
      let description = '';

      if (publication.likes.length > 2) {
        description = `${topLikesNames.join(', ')} y otros le dieron me gusta a tu publicación.`;
      } else if (publication.likes.length === 2) {
        description = `${topLikesNames.join(' y ')} le dieron me gusta a tu publicación.`;
      } else if (publication.likes.length === 1) {
        description = `${topLikesNames.join(', ')} le dio me gusta a tu publicación.`;
      }
      return description;
    };

    if (userAlreadyLiked) {
      publication.likes = publication.likes.filter((likedUser) => likedUser.id !== user.id);

      if (existingNotification) {
        const updatedDescription = getNotificationDescription();
        if (updatedDescription !== '') {
          existingNotification.description = updatedDescription;
          await updateNotificationUseCase.execute(existingNotification);
        } else {
          await deleteNotificationByIdUseCase.execute(existingNotification.id);
        }
      }
    } else {
      publication.likes.push(user);

      if (!existingNotification) {
        const notification = new Notification();
        notification.user = publication.user;
        notification.publication = publication;
        notification.isRead = false;
        notification.itinerary = null;
        notification.description = getNotificationDescription();

        const createNotificationUseCase = new CreateNotificationUseCase();
        await createNotificationUseCase.execute(notification);
      } else {
        existingNotification.isRead=false;
        existingNotification.description = getNotificationDescription();
        await updateNotificationUseCase.execute(existingNotification);
      }
    }
    return this.updatePublication(publication);
  }



  handleSaved(publication: Publication | null, user: User) {
    if (!publication) {
      throw new Error('La publicación es nula o no se encontró.');
    }

    const userAlreadySaved = publication.saved.some((savedUser) => savedUser.id === user.id);

    if (userAlreadySaved) {
      publication.saved = publication.saved.filter((savedUser) => savedUser.id !== user.id);
    } else {
      publication.saved.push(user);
    }

    return this.updatePublication(publication);
  }

  handleReposts(publication: Publication | null, user: User) {
    if (!publication) {
      throw new Error('La publicación es nula o no se encontró.');
    }

    const userAlreadyRepost = publication.reposts.some((repostUser) => repostUser.id === user.id);

    if (userAlreadyRepost) {
      publication.reposts = publication.reposts.filter((repostUser) => repostUser.id !== user.id);
    } else {
      publication.reposts.push(user);
    }

    return this.updatePublication(publication);
  }

  private updatePublication(publication: Publication) {
    const updatePublicationUseCase = new UpdatePublicationUseCase();

    return updatePublicationUseCase.execute(publication);
  }
}
