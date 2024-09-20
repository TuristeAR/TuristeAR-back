import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/data-source';

describe('GET /', () => {
  it('should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});

describe('Database Initialization', () => {
  it('should initialize the database connection', async () => {
    await expect(AppDataSource.initialize()).resolves.not.toThrow();
    await AppDataSource.destroy();
  });
});
