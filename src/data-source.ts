import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './entities/user';
import { Weather } from './entities/weather';
import { Province } from './entities/province';
import { Place } from './entities/place';
import { Review } from './entities/review';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Weather, Province, Place, Review],
  synchronize: true,
  logging: true,
  timezone: '-03:00',
});
