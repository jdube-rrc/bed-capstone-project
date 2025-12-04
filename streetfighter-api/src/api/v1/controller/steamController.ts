import { Request, Response } from 'express';

export const getSteamFriendCode = (req: Request, res: Response) => {
  res.json({ steamFriendCode: '40434742' });
};
