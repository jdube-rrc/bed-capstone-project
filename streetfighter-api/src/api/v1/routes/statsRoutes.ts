import express from 'express';
import { topDamage, topAverageDamage } from '../controller/statsController';

const router = express.Router();

/**
 * @openapi
 * /api/v1/stats/top-damage:
 *   get:
 *     summary: Return characters ranked by top single-move damage
 *     tags:
 *       - Stats
 *     responses:
 *       200:
 *         description: Array of characters with top damage values
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   character:
 *                     type: string
 *                   topDamage:
 *                     type: number
 */
router.get('/top-damage', topDamage);

/**
 * @openapi
 * /api/v1/stats/top-average-damage:
 *   get:
 *     summary: Return characters ranked by average damage across moves
 *     tags:
 *       - Stats
 *     responses:
 *       200:
 *         description: Array of characters with average damage values
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   character:
 *                     type: string
 *                   averageDamage:
 *                     type: number
 */
router.get('/top-average-damage', topAverageDamage);

export default router;
