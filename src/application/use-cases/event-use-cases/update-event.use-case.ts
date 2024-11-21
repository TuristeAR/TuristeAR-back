import { Event } from '../../../domain/entities/event';
import { EventRepositoryInterface } from '../../../domain/repositories/event.repository.interface';
import { EventRepository } from '../../../infrastructure/repositories/event.repository';

export class UpdateEventUseCase {
  private eventRepository: EventRepositoryInterface;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  execute(event: Event): Promise<Event> {
    return this.eventRepository.save(event);
  }
}
