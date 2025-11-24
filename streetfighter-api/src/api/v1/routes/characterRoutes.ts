import express from 'express';
import {
  listCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter
} from '../controller/characterController';

const router = express.Router();

router.get('/', listCharacters);
router.get('/:id', getCharacter);
router.post('/', createCharacter);
router.put('/:id', updateCharacter);
router.delete('/:id', deleteCharacter);

export default router;
