import { EventTempRepositoryInterface } from '../../../domain/repositories/event_temp.repository.interfaz';
import { EventTemp } from '../../../domain/entities/event_temp';
import { EventTempRepository } from '../../../infrastructure/repositories/eventTemp.repository';

export class CreateEventTempUseCase {
    private eventTempRepository: EventTempRepositoryInterface;

    constructor() {
        this.eventTempRepository = new EventTempRepository();
    }

    execute(eventTemp: EventTemp): Promise<EventTemp> {
        return this.eventTempRepository.save(eventTemp);
    }
}