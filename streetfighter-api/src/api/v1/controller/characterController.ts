import { Request, Response, NextFunction } from 'express';
import { dataStore } from '../../../utils/dataLoader';

export const listCharacters = (req: Request, res: Response) => {
  const list = dataStore.getAll();
  const summary = String(req.query.summary || '') === 'true' || String(req.query.summary || '') === '1';

  if (summary) {
    const summarized = list.map((c) => ({
      character: c.character,
      url: c.url,
      scrapedAt: c.scrapedAt,
      categoriesCount: Array.isArray(c.categories) ? c.categories.length : 0
    }));
    return res.json({ total: summarized.length, characters: summarized });
  }

  res.json({ total: list.length, characters: list });
};

export const getCharacter = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const item = dataStore.getById(id);
  if (!item) return res.status(404).json({ message: 'Character not found' });
  return res.json(item);
};

export const createCharacter = (req: Request, res: Response) => {
  const payload = req.body;
  if (!payload || !payload.character) {
    return res.status(400).json({ message: 'Invalid payload: missing character field' });
  }
  const created = dataStore.create(payload);
  return res.status(201).json(created);
};

export const updateCharacter = (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const updated = dataStore.update(id, payload);
  if (!updated) return res.status(404).json({ message: 'Character not found' });
  return res.json(updated);
};

export const deleteCharacter = (req: Request, res: Response) => {
  const id = req.params.id;
  const removed = dataStore.delete(id);
  if (!removed) return res.status(404).json({ message: 'Character not found' });
  return res.status(204).send();
};
