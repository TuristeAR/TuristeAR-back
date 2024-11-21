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
import { Category } from '../entities/category';

export class PublicationService {
  async createPublication(publicationDTO: CreatePublicationDTO, user: User): Promise<Publication> {
    const { description, activities } = publicationDTO;

    const newPublication = new Publication();

    newPublication.description = description;
    newPublication.likes = [];
    newPublication.reposts = [];
    newPublication.saved = [];
    newPublication.categories = [];

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

      const idCategories = [...new Set(
        activityEntities
          .map(activity => activity.place.province.category?.id)
          .filter(id => id !== undefined)
      )];

      for (const id of idCategories) {
        newPublication.categories.push(<Category> await findCategoryByIdUseCase.execute(Number(id)))
      }

      newPublication.activities = activityEntities;
      newPublication.user = user;

      const createPublicationUseCase = new CreatePublicationUseCase();

      return createPublicationUseCase.execute(newPublication);
    } catch (error) {
      console.log(error)
      throw new Error(error as string);
    }
  }

  async handleInteraction(publication: Publication | null, user: User, interactionType: 'like' | 'saved' | 'repost') {
    if (!publication) {
      throw new Error('La publicación es nula o no se encontró.');
    }

    const interactionMap = {
      like: {
        list: publication.likes,
        notificationType: 'me gusta',
        descriptionPrefixSingular: 'le dio me gusta a tu publicación',
        descriptionPrefixPlural: 'le dieron me gusta a tu publicación'
      },
      saved: {
        list: publication.saved,
        notificationType: 'guardado',
        descriptionPrefixSingular: 'ha guardado tu publicación',
        descriptionPrefixPlural: 'han guardado tu publicación'
      },
      repost: {
        list: publication.reposts,
        notificationType: 'compartido',
        descriptionPrefixSingular: 'ha compartido tu publicación',
        descriptionPrefixPlural: 'han compartido tu publicación'
      }
    };

    const { list, notificationType, descriptionPrefixSingular, descriptionPrefixPlural } = interactionMap[interactionType];
    const userAlreadyInteracted = list.some((item) => item.id === user.id);

    const findNotificationByPublicationIdUseCase = new FindNotificationByPublicationIdAndTypeUseCase();
    const deleteNotificationByIdUseCase = new DeleteNotificationByIdUseCase();
    const updateNotificationUseCase = new UpdateNotificationUseCase();
    const existingNotification = await findNotificationByPublicationIdUseCase.execute(publication.id, notificationType);
    const newNotification = new Notification();

    const getNotificationDescription = () => {
      const topNames = list.slice(0, 3).map((item) => item.name);
      if (list.length > 2) {
        return `${topNames.join(', ')} y otros ${descriptionPrefixPlural}.`;
      } else if (list.length === 2) {
        return `${topNames.join(' y ')} ${descriptionPrefixPlural}.`;
      } else if (list.length === 1) {
        return `${topNames[0]} ${descriptionPrefixSingular}.`;
      }
      return '';
    };

    if (userAlreadyInteracted) {
      list.splice(list.findIndex((item) => item.id === user.id), 1);
      await this.updatePublication(publication);
      if (existingNotification) {
        const updatedDescription = getNotificationDescription();
        if (updatedDescription) {
          existingNotification.description = updatedDescription;
          await updateNotificationUseCase.execute(existingNotification);
        } else {
          await deleteNotificationByIdUseCase.execute(existingNotification.id);
        }
      }
    } else {
      list.push(user);
      const updatedPublication= await this.updatePublication(publication);
      if (!existingNotification) {
        newNotification.user = updatedPublication.user;
        newNotification.publication = updatedPublication;
        newNotification.isRead = false;
        newNotification.itinerary = null;
        newNotification.description = getNotificationDescription();
        const createNotificationUseCase = new CreateNotificationUseCase();
        await createNotificationUseCase.execute(newNotification);
      } else {
        existingNotification.isRead = false;
        existingNotification.description = getNotificationDescription();
        await updateNotificationUseCase.execute(existingNotification);
      }
    }
    return publication;
  }

  private updatePublication(publication: Publication) {
    const updatePublicationUseCase = new UpdatePublicationUseCase();
    return updatePublicationUseCase.execute(publication);
  }

  async handleLike(publication: Publication | null, user: User) {
    return this.handleInteraction(publication, user, 'like');
  }

  async handleSaved(publication: Publication | null, user: User) {
    return this.handleInteraction(publication, user, 'saved');
  }

  async handleReposts(publication: Publication | null, user: User) {
    return this.handleInteraction(publication, user, 'repost');
  }

}
