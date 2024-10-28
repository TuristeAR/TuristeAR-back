import { Event } from '../../../domain/entities/event';
import { EventRepositoryInterface } from '../../../domain/repositories/event.repository.interface';
import { EventRepository } from '../../../infrastructure/repositories/event.repository';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

export class FindEventByProvinceAndDatesUseCase {
  private eventRepository: EventRepositoryInterface;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  execute(provinceId: number, fromDate: Date, toDate: Date): Promise<Event[]> {
    return this.eventRepository.findMany({
      where: {
        province: { id: provinceId },
        fromDate: MoreThanOrEqual(fromDate),
        toDate: LessThanOrEqual(toDate),
      },
      relations: ['province'],
    });
  }
}
