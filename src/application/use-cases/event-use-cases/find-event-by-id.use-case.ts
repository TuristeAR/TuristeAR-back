import { EventRepository } from '../../../infrastructure/repositories/event.repository';
import { EventRepositoryInterface } from '../../../domain/repositories/event.repository.interface';
import { Event } from '../../../domain/entities/event';

export class FindEventByIdUseCase {
  private eventRepository: EventRepositoryInterface;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  execute(id: number): Promise<Event | null> {
    return this.eventRepository.findOne({ where: { id: id } });
  }
}
