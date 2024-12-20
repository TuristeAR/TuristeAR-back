import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../../domain/entities/user';
import { Weather } from '../../domain/entities/weather';
import { Province } from '../../domain/entities/province';
import { Place } from '../../domain/entities/place';
import { Event } from '../../domain/entities/event';
import { Review } from '../../domain/entities/review';
import { Itinerary } from '../../domain/entities/itinerary';
import { Activity } from '../../domain/entities/activity';
import { Publication } from '../../domain/entities/publication';
import { Category } from '../../domain/entities/category';
import { Message } from '../../domain/entities/message';
import { Forum } from '../../domain/entities/forum';
import { Expense } from '../../domain/entities/expense';
import { Comment } from '../../domain/entities/comment';
import { Notification } from '../../domain/entities/notification';
import { EventTemp } from '../../domain/entities/event_temp';
import { ParticipationRequest } from '../../domain/entities/participationRequest';
import { UserExpense } from '../../domain/entities/user_expense';
import { Type } from '../../domain/entities/type';
import { PriceLevel } from '../../domain/entities/price_level';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User,
    Weather,
    Province,
    Place,
    Event,
    EventTemp,
    Review,
    Itinerary,
    Activity,
    Publication,
    Category,
    Forum,
    Message,
    Comment,
    Expense,
    Notification, 
    ParticipationRequest,
    UserExpense,
    Type,
    PriceLevel,
  ],
  synchronize: true,
  logging: true,
  timezone: '-03:00',
});
