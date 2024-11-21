import {
  Repository,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  UpdateResult,
  DeleteResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {
  FindItineraryByUserWithParticipantsUseCase
} from '../../application/use-cases/itinerary-use-cases/find-itinerary-by-user-with-participants.use-case';

export abstract class AbstractRepository<T extends ObjectLiteral> {
  protected constructor(protected readonly repository: Repository<T>) {}

  create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  findMany(options: FindManyOptions<T>, limit?: number): Promise<T[]> {
    return this.repository.find({ ...options, ...(limit && { take: limit }) });
  }

  update(id: number, data: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
    return this.repository.update(id, data);
  }

  deleteOne(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  deleteMany(criteria: any): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  save(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity);
  }

  findByProvinceLocalityTypes(
    provinceId: number,
    locality: string,
    type: string,
    priceLevels: string[],
  ): Promise<T[]> {
    return this.repository
      .createQueryBuilder('place')
      .where('place.provinceId = :provinceId', { provinceId })
      .andWhere('place.locality = :locality', { locality })
      .andWhere('place.types LIKE :type', { type: `%${type}%` })
      .andWhere('place.priceLevel IN (:...priceLevels)', { priceLevels })
      .limit(50)
      .getMany();
  }

  findPublicationsByLikes(userId: number): Promise<T[]> {
    return this.repository.createQueryBuilder('publication')
      .innerJoin('publication.likes', 'like')
      .leftJoinAndSelect('publication.user', 'userDetails')
      .leftJoinAndSelect('publication.likes', 'likes')
      .leftJoinAndSelect('publication.categories', 'categories')
      .leftJoinAndSelect('publication.reposts', 'reposts')
      .leftJoinAndSelect('publication.saved', 'saved')
      .leftJoinAndSelect('publication.comments', 'comments')
      .leftJoinAndSelect('publication.activities', 'activities')
      .leftJoinAndSelect('activities.place', 'place')
      .where('like.id = :userId', { userId })
      .orderBy('publication.id', 'DESC')
      .getMany();
  }

  findPublicationsBySaved(userId: number): Promise<T[]> {
    return this.repository.createQueryBuilder('publication')
      .innerJoin('publication.saved', 'save')
      .leftJoinAndSelect('publication.user', 'userDetails')
      .leftJoinAndSelect('publication.likes', 'likes')
      .leftJoinAndSelect('publication.categories', 'categories')
      .leftJoinAndSelect('publication.reposts', 'reposts')
      .leftJoinAndSelect('publication.saved', 'saved')
      .leftJoinAndSelect('publication.comments', 'comments')
      .leftJoinAndSelect('publication.activities', 'activities')
      .leftJoinAndSelect('activities.place', 'place')
      .where('save.id = :userId', { userId })
      .orderBy('publication.id', 'DESC')
      .getMany();
  }

  findItineraryByUserWithParticipants(id : number): Promise<T[]> {
    return this.repository.createQueryBuilder('itinerary')
      .innerJoin('itinerary.user', 'user')
      .leftJoin('itinerary.participants', 'participant')
      .leftJoinAndSelect('itinerary.user', 'userDetail')
      .leftJoinAndSelect('itinerary.participants', 'participants')
      .leftJoinAndSelect('itinerary.activities', 'activities')
      .leftJoinAndSelect('activities.place', 'place')
      .leftJoinAndSelect('place.province', 'province')
      .leftJoinAndSelect('province.category', 'category')
      .where('user.id = :id',{id})
      .orWhere('participant.id = :id', {id})
      .addOrderBy('itinerary.id', 'DESC')
      .getMany();
  }


}
