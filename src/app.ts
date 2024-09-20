import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import status from 'http-status';
import { AppDataSource } from './data-source';
import { UserService } from './services/user.service';
import { CreateUserDto } from './dtos/create-user.dto';

dotenv.config();

const getCorsOrigins = () => {
  const corsOriginsString = process.env.CORS_ORIGINS || '';

  return corsOriginsString.split(',').map((origin) => origin.trim());
};

const app = express();

const userService = new UserService();

app.use(bodyParser.json());

app.use(cors({ credentials: true, origin: getCorsOrigins() }));

app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', req.headers.origin);
  res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(status.OK);
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    app.listen(process.env.HTTP_PORT, () => {
      console.log(`Server running on port ${process.env.HTTP_PORT}`);
    });
  })
  .catch((error) => console.log('Data Source initialization error', error));

app.get('/', (_req, res) => {
  res.status(status.OK).send('TuristeAR API');
});

app.post('/user', async (req, res) => {
  const createUserDto: CreateUserDto = req.body;

  try {
    const user = await userService.create(createUserDto);

    res.status(status.CREATED).send(user);
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).send(error);
  }
});

export default app;
