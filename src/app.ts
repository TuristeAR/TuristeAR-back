import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import status from 'http-status';
import passport from 'passport';
import { initializePassport } from './config/passport';
import { AppDataSource } from './data-source';
import { UserService } from './services/user.service';
import { User } from './entities/user';

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

app.set('trust proxy', true);

console.log('secure', process.env.NODE_ENV === 'production');
console.log('sameSite', process.env.NODE_ENV === 'production' ? 'none' : 'lax');
console.log('domain', process.env.NODE_ENV === 'production' ? '.koyeb.app' : 'localhost');

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.koyeb.app' : 'localhost',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

initializePassport(passport);

app.use(passport.session());

app.use(passport.initialize());

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    app.listen(process.env.HTTP_PORT, () => {
      console.log(`Server running on port ${process.env.HTTP_PORT}`);
    });
  })
  .catch((error) => console.log('Data Source initialization error', error));

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

app.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', (err: any, user: User) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.redirect(`${process.env.FRONTEND_URL}/login`);
      }

      res.redirect(`${process.env.FRONTEND_URL}`);
    });
  })(req, res, next);
});

app.get('/session', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.send({
      statusCode: status.OK,
      message: 'User is authenticated',
      user: req.user,
    });
  }

  return res.status(401).send({
    statusCode: status.UNAUTHORIZED,
    message: 'User is not authenticated',
  });
});

export default app;
