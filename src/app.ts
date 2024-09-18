import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import status from 'http-status';

dotenv.config();

const getCorsOrigins = () => {
  const corsOriginsString = process.env.CORS_ORIGINS || '';

  return corsOriginsString.split(',').map((origin) => origin.trim());
};

const app = express();

app.use(bodyParser.json());

app.use(cors({ credentials: true, origin: getCorsOrigins() }));

app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', req.headers.origin);
  res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(status.OK);
});

app.listen(process.env.HTTP_PORT, () => {
  console.log(`Server running on port ${process.env.HTTP_PORT}`);
});

app.get('/', (_req, res) => {
  res.status(status.OK).send('TuristeAR API');
});

export default app;
