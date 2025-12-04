import express from 'express';
import { setAdminClaim } from '../controller/adminController';

const router = express.Router();

/**
 * @openapi
 * /api/v1/admin/users/{uid}/claims:
 *   post:
 *     summary: Set or unset the `admin` custom claim on a Firebase user.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: The UID of the user to set or unset the admin claim for.
 *     requestBody:
 *       description: Object containing the admin claim to set or unset.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               admin:
 *                 type: boolean
 *                 description: Whether to set or unset the admin claim.
 *             required:
 *               - admin
 *     responses:
 *       200:
 *         description: Successfully set or unset the admin claim.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uid:
 *                   type: string
 *                   description: The UID of the user.
 *                 admin:
 *                   type: boolean
 *                   description: The updated admin claim value.
 *       400:
 *         description: Missing uid parameter.
 *       500:
 *         description: Failed to set admin claim.
 */
router.post('/users/:uid/claims', setAdminClaim);

export default router;
