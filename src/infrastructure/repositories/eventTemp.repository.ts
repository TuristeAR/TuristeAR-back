import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { EventTemp } from '../../domain/entities/event_temp';
import { EventTempRepositoryInterface } from '../../domain/repositories/event_temp.repository.interfaz';

export class EventTempRepository
    extends AbstractRepository<EventTemp>
    implements EventTempRepositoryInterface {
    constructor() {
        super(AppDataSource.getRepository(EventTemp));
    }
}
