import { Request, Response, NextFunction } from 'express';
import dataService from '../service/dataService';

export const listCharacters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await dataService.getAll();
    const summary = String(req.query.summary || '') === 'true' || String(req.query.summary || '') === '1';

    if (summary) {
      const summarized = list.map((c) => ({
        character: c.character,
        url: (c as any).url,
        scrapedAt: (c as any).scrapedAt,
        categoriesCount: Array.isArray((c as any).categories) ? (c as any).categories.length : 0
      }));
      return res.json({ total: summarized.length, characters: summarized });
    }

    return res.json({ total: list.length, characters: list });
  } catch (err) {
    next(err);
  }
};

export const getCharacter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const item = await dataService.getById(id);
    if (!item) return res.status(404).json({ message: 'Character not found' });
    return res.json(item);
  } catch (err) {
    next(err);
  }
};

export const getMove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const categoryId = req.params.categoryId;
    const moveName = req.params.moveName;

    const item = await dataService.getById(id);
    if (!item) return res.status(404).json({ message: 'Character not found' });

    const categories = Array.isArray(item.categories) ? item.categories : [];
    const category = categories.find((c: any) => String(c.categoryId) === String(categoryId) || String(c.categoryName).toLowerCase() === String(categoryId).toLowerCase());
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const moves = Array.isArray(category.moves) ? category.moves : [];
    const move = moves.find((m: any) => String(m.name).toLowerCase() === String(moveName).toLowerCase());
    if (!move) return res.status(404).json({ message: 'Move not found' });

    return res.json({ character: item.character, category: { categoryId: category.categoryId, categoryName: category.categoryName }, move });
  } catch (err) {
    next(err);
  }
};

// commented this out because it was purely for the demonstration, will leave it here for reference

// export const getMoveAscii = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const id = req.params.id;
//     const categoryId = req.params.categoryId;
//     const moveName = req.params.moveName;

//     if (String(id).toLowerCase() === 'ryu' && String(categoryId).toLowerCase() === 'specialmoves' && String(moveName).toLowerCase() === 'hadoken') {
//       res.setHeader('Content-Type', 'text/plain; charset=utf-8');
//       return res.status(200).send(ryuHadokenAscii);
//     }

//     const item = await dataService.getById(id);
//     if (!item) return res.status(404).json({ message: 'Character not found' });

//     const categories = Array.isArray(item.categories) ? item.categories : [];
//     const category = categories.find((c: any) => String(c.categoryId) === String(categoryId) || String(c.categoryName).toLowerCase() === String(categoryId).toLowerCase());
//     if (!category) return res.status(404).json({ message: 'Category not found' });

//     const moves = Array.isArray(category.moves) ? category.moves : [];
//     const move = moves.find((m: any) => String(m.name).toLowerCase() === String(moveName).toLowerCase());
//     if (!move) return res.status(404).json({ message: 'Move not found' });

//     const art = move.asciiArt || move.ascii || move.art;
//     if (!art || typeof art !== 'string' || art.trim() === '') {
//       return res.status(404).json({ message: 'ASCII art not found for this move' });
//     }

//     res.setHeader('Content-Type', 'text/plain; charset=utf-8');
//     return res.status(200).send(art);
//   } catch (err) {
//     next(err);
//   }
// };

export const createCharacter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    if (!payload || !payload.character) {
      return res.status(400).json({ message: 'Invalid payload: missing character field' });
    }
    const created = await dataService.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const updateCharacter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const updated = await dataService.update(id, payload);
    if (!updated) return res.status(404).json({ message: 'Character not found' });
    return res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteCharacter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const removed = await dataService.remove(id);
    if (!removed) return res.status(404).json({ message: 'Character not found' });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
