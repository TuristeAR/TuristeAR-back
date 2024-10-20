import { Publication } from '../entities/publication';
import { CreatePublicationDTO } from '../../infrastructure/dtos/create-publication.dto';
import { User } from '../entities/user';
import { CreatePublicationUseCase } from '../../application/use-cases/publication-use-cases/create-publication.use-case';
import { FindCategoryByIdUseCase } from '../../application/use-cases/category-use-cases/find-category-by-id.use-case';
import { UpdatePublicationUseCase } from '../../application/use-cases/publication-use-cases/update-publication.use-case';

export class PublicationService {
  async createPublication(publicationDTO: CreatePublicationDTO, user: User): Promise<Publication> {
    const { description, images, categoryId } = publicationDTO;

    const newPublication = new Publication();

    newPublication.description = description;
    newPublication.images = images;
    newPublication.likes = [];
    newPublication.reposts = [];
    newPublication.saved = [];
    newPublication.creationDate = new Date();

    try {
      const findCategoryByIdUseCase = new FindCategoryByIdUseCase();

      const category = await findCategoryByIdUseCase.execute(categoryId);

      if (!category) {
        throw new Error('Categoría no encontrada');
      }

      newPublication.category = category;

      newPublication.user = user;

      const createPublicationUseCase = new CreatePublicationUseCase();

      return createPublicationUseCase.execute(newPublication);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  handleLike(publication: Publication | null, user: User) {
    if (!publication) {
      throw new Error('La publicación es nula o no se encontró.');
    }

    const userAlreadyLiked = publication.likes.some((likedUser) => likedUser.id === user.id);

    if (userAlreadyLiked) {
      publication.likes = publication.likes.filter((likedUser) => likedUser.id !== user.id);
    } else {
      publication.likes.push(user);
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
