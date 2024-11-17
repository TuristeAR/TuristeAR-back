import { DeleteResult, FindOneOptions } from 'typeorm';
import { Publication } from '../entities/publication';

export interface PublicationRepositoryInterface {

  findOne(options: FindOneOptions<Publication>): Promise<Publication | null>;
  findMany(options: FindOneOptions<Publication>): Promise<Publication[]>;
  save(publication: Publication): Promise<Publication>;
  deleteOne(id: number): Promise<DeleteResult>;
  deleteMany(publicationsIds: number[]): Promise<DeleteResult>;
  findPublicationsByLikes(id: number): Promise<Publication[]>;
  findPublicationsBySaved(id: number): Promise<Publication[]>;
}
