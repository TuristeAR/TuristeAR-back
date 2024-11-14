import { DeepPartial, DeleteResult, FindOneOptions } from 'typeorm';
import { ParticipationRequest } from '../entities/participationRequest';

export interface ParticipationRequestRepositoryInterface {
  create(data: DeepPartial<ParticipationRequest>): Promise<ParticipationRequest>;
  findOne(options: FindOneOptions<ParticipationRequest>): Promise<ParticipationRequest | null>;

  findMany(options: FindOneOptions<ParticipationRequest>): Promise<ParticipationRequest[]>;

  save(participationRequest: ParticipationRequest): Promise<ParticipationRequest>;

  deleteOne(participationRequest: number): Promise<DeleteResult>;
  updateStatus(id: number, status: string): Promise<ParticipationRequest>;

}