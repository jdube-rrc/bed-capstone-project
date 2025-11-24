import express from 'express';
import { topDamage, topAverageDamage } from '../controller/statsController';

const router = express.Router();

router.get('/top-damage', topDamage);
router.get('/top-average-damage', topAverageDamage);

export default router;
