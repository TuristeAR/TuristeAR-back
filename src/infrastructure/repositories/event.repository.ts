import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { EventRepositoryInterface } from '../../domain/repositories/event.repository.interface';
import { Event } from '../../domain/entities/event';

export class EventRepository extends AbstractRepository<Event> implements EventRepositoryInterface {
  constructor() {
    super(AppDataSource.getRepository(Event));
  }
}
