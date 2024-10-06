import { Request, Response, NextFunction } from 'express';
import status from 'http-status';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(status.UNAUTHORIZED).json({
    statusCode: status.UNAUTHORIZED,
    message: 'Unauthorized',
  });
};
