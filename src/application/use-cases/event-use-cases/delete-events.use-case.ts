import { DeleteResult } from 'typeorm';
import { EventRepositoryInterface } from '../../../domain/repositories/event.repository.interface';
import { EventRepository } from '../../../infrastructure/repositories/event.repository';
import { Event } from '../../../domain/entities/event';

export class DeleteEventsUseCase {
  private eventRepository: EventRepositoryInterface;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  execute(events: Event[]): Promise<DeleteResult> {
    return this.eventRepository.deleteMany(events.map(event => event.id));
  }
}
