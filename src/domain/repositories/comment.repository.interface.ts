import { DeleteResult, FindOneOptions } from 'typeorm';
import { Publication } from '../entities/publication';
import { Comment } from '../entities/comment';

export interface CommentRepositoryInterface {
  findOne(options: FindOneOptions<Comment>): Promise<Comment | null>;
  findMany(options: FindOneOptions<Comment>): Promise<Comment[]>;
  save(comment: Comment): Promise<Comment>;
  deleteMany(ids: number[]): Promise<DeleteResult>;
}
