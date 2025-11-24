import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // lightweight logger
  // eslint-disable-next-line no-console
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
};
