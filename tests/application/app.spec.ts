import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import request from 'supertest';
import app from '../../src/application/app';

jest.mock('passport', () => ({
  authenticate: jest.fn((strategy, callback) => {
    return (req: Request, res: Response, next: NextFunction) => {
      next();
    };
  }),
  initialize: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next()),
  session: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next()),
  use: jest.fn(),
  serializeUser: jest.fn(),
  deserializeUser: jest.fn(),
}));

describe('GET /auth/google/callback', () => {
  let mockLogIn: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();

    mockLogIn = jest.fn((user, callback) => {
      callback();
    });

    (passport.authenticate as jest.Mock).mockImplementation((strategy, callback) => {
      return (req: Request, res: Response, next: NextFunction) => {
        req.logIn = mockLogIn;
        const user = { id: 1 };
        return callback(null, user);
      };
    });
  });

  it('redirects to frontend login on authentication failure', async () => {
    (passport.authenticate as jest.Mock).mockImplementation((strategy, callback) => {
      return (req: Request, res: Response, next: NextFunction) => {
        return callback(new Error('Authentication failed'), null);
      };
    });

    const response = await request(app).get('/auth/google/callback');
    expect(response.headers.location).toBe(`${process.env.FRONTEND_URL}/login`);
  });

  it('redirects to frontend on successful authentication', async () => {
    const response = await request(app).get('/auth/google/callback');
    expect(response.headers.location).toBe(`${process.env.FRONTEND_URL}/formQuestion`);
  });
});
