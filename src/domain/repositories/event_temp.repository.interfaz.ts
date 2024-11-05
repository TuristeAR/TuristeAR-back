import { DeleteResult, FindOneOptions } from 'typeorm';
import { EventTemp} from '../entities/event_temp';

export interface EventTempRepositoryInterface {
    findOne(options: FindOneOptions<EventTemp>): Promise<EventTemp | null>;
    findMany(options: FindOneOptions<EventTemp>): Promise<EventTemp[]>;
    save(publication: EventTemp): Promise<EventTemp>;
    deleteOne(id: number): Promise<DeleteResult>;
}
