/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Move:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         asciiArt:
 *           type: string
 *         inputs:
 *           type: string
 *     Category:
 *       type: object
 *       properties:
 *         categoryId:
 *           type: string
 *         categoryName:
 *           type: string
 *         moves:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Move'
 *     Character:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         character:
 *           type: string
 *         url:
 *           type: string
 *         scrapedAt:
 *           type: string
 *           format: date-time
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */
import express from 'express';
import {
  listCharacters,
  getCharacter,
  getMove,
  // getMoveAscii,
  createCharacter,
  updateCharacter,
  deleteCharacter
} from '../controller/characterController';
import authenticate from '../middleware/authenticate';
import isAuthorized from '../middleware/authorize';

const router = express.Router();

router.get('/', listCharacters);

/**
 * @openapi
 * /api/v1/characters:
 *   get:
 *     summary: List characters
 *     tags:
 *       - Characters
 *     parameters:
 *       - in: query
 *         name: summary
 *         schema:
 *           type: boolean
 *         description: Return a summarized view of characters
 *     responses:
 *       200:
 *         description: A list of characters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 characters:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Character'
 */

router.get('/:id/moves/:categoryId/:moveName', getMove);

/**
 * @openapi
 * /api/v1/characters/{id}/moves/{categoryId}/{moveName}:
 *   get:
 *     summary: Get a specific move for a character
 *     tags:
 *       - Characters
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Character id (or name)
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category id or name
 *       - in: path
 *         name: moveName
 *         required: true
 *         schema:
 *           type: string
 *         description: Move name (URL-encoded if needed)
 *     responses:
 *       200:
 *         description: Move details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 character:
 *                   type: string
 *                 category:
 *                   type: object
 *                   properties:
 *                     categoryId:
 *                       type: string
 *                     categoryName:
 *                       type: string
 *                 move:
 *                   $ref: '#/components/schemas/Move'
 *       404:
 *         description: Character, category or move not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// router.get('/:id/moves/:categoryId/:moveName/ascii', getMoveAscii);

router.get('/:id', getCharacter);

/**
 * @openapi
 * /api/v1/characters/{id}:
 *   get:
 *     summary: Get a character by id
 *     tags:
 *       - Characters
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Character object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Character'
 *       404:
 *         description: Character not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


router.post('/', authenticate, isAuthorized({ hasRole: ['admin'], allowSameUser: false }), createCharacter);

/**
 * @openapi
 * /api/v1/characters:
 *   post:
 *     summary: Create a new character (admin only)
 *     tags:
 *       - Characters
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Character'
 *     responses:
 *       201:
 *         description: Character created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Character'
 *       400:
 *         description: Invalid payload
 */

router.put('/:id', authenticate, isAuthorized({ hasRole: ['admin'], allowSameUser: false }), updateCharacter);

/**
 * @openapi
 * /api/v1/characters/{id}:
 *   put:
 *     summary: Update a character (admin only)
 *     tags:
 *       - Characters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Character'
 *     responses:
 *       200:
 *         description: Character updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Character'
 *       404:
 *         description: Character not found
 */

router.delete('/:id', authenticate, isAuthorized({ hasRole: ['admin'], allowSameUser: false }), deleteCharacter);

/**
 * @openapi
 * /api/v1/characters/{id}:
 *   delete:
 *     summary: Delete a character (admin only)
 *     tags:
 *       - Characters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Character deleted
 *       404:
 *         description: Character not found
 */

export default router;
