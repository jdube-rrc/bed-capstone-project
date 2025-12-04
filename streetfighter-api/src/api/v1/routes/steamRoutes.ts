import express from 'express';
import { getSteamFriendCode } from '../controller/steamController';

const router = express.Router();

/**
 * @openapi
 * /api/v1/steam/friend-code:
 *   get:
 *     summary: Get the configured Steam friend code
 *     tags:
 *       - Meta
 *     responses:
 *       200:
 *         description: Steam friend code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 steamFriendCode:
 *                   type: string
 */
router.get('/friend-code', getSteamFriendCode);

export default router;
