import { Request, Response, NextFunction } from 'express';
import status from 'http-status';
import { authMiddleware } from '../../../src/infrastructure/middlewares/auth.middleware';

describe('authMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next if user is authenticated', () => {
    // @ts-ignore
    req.isAuthenticated = jest.fn().mockReturnValue(true);

    authMiddleware(req as Request, res as Response, next);

    expect(req.isAuthenticated).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 401 if user is not authenticated', () => {
    // @ts-ignore
    req.isAuthenticated = jest.fn().mockReturnValue(false);

    authMiddleware(req as Request, res as Response, next);

    expect(req.isAuthenticated).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(status.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: status.UNAUTHORIZED,
      message: 'Unauthorized',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if isAuthenticated is not defined on the request', () => {
    req.isAuthenticated = undefined;

    authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(status.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: status.UNAUTHORIZED,
      message: 'Unauthorized',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
