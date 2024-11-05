import { DeepPartial, DeleteResult, FindOneOptions } from 'typeorm';
import { Itinerary } from '../entities/itinerary';

export interface ItineraryRepositoryInterface {
  create(data: DeepPartial<Itinerary>): Promise<Itinerary>;
  findOne(options: FindOneOptions<Itinerary>): Promise<Itinerary | null>;
  findMany(options: FindOneOptions<Itinerary>): Promise<Itinerary[]>;
  save(user: Itinerary): Promise<Itinerary>;

  deleteOne(id: number): Promise<DeleteResult>;
}
