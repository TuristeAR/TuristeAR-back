import { Event } from '../../../domain/entities/event';
import { EventRepositoryInterface } from '../../../domain/repositories/event.repository.interface';
import { EventRepository } from '../../../infrastructure/repositories/event.repository';

export class FindEventByProvinceUseCase {
  private eventRepository: EventRepositoryInterface;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  execute(provinceId: number): Promise<Event[]> {
    return this.eventRepository.findMany({
      where: { province: { id: provinceId } },
      relations: ['province'],
    });
  }
}
