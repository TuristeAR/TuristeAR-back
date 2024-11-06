import { DeepPartial, FindOneOptions } from 'typeorm';
import {Notification} from '../entities/notification';

export interface NotificationRepositoryInterface {
  create(data: DeepPartial<Notification>): Promise<Notification>;
  findOne(options: FindOneOptions<Notification>): Promise<Notification | null>;

  findMany(options: FindOneOptions<Notification>): Promise<Notification[]>;
}