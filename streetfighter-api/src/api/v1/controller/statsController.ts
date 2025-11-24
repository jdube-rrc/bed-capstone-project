import { Request, Response } from 'express';
import { topByMaxMoveDamage, topByAverageMoveDamage } from '../service/statsService';

export const topDamage = (req: Request, res: Response) => {
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const results = topByMaxMoveDamage(limit);
  res.json({ total: results.length, results });
};

export const topAverageDamage = (req: Request, res: Response) => {
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const results = topByAverageMoveDamage(limit);
  res.json({ total: results.length, results });
};
