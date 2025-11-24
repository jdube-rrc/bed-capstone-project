import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // placeholder: allow all requests but set a fake user if Authorization header present
  const auth = req.header('authorization');
  if (auth) {
    // attach a simple user object
    // @ts-ignore
    req.user = { id: 'dev', role: 'admin' };
  }
  next();
};
