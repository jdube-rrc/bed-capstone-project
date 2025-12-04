import { Request, Response, NextFunction } from 'express';
import { auth } from '../../../config/firebaseConfig';
import { ServiceError } from '../errors/errors';

/**
 * Set or unset the `admin` custom claim on a Firebase user.
 * - URL: POST /api/v1/admin/users/:uid/claims
 * - Body: { admin: boolean }
 */
export const setAdminClaim = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { uid } = req.params;
    const { admin: adminFlag } = req.body as { admin?: boolean };

    if (!uid) {
      return res.status(400).json({ message: 'Missing uid parameter' });
    }

    const flag = typeof adminFlag === 'boolean' ? adminFlag : true;

    await auth.setCustomUserClaims(uid, { admin: flag });

    return res.status(200).json({ uid, admin: flag });
  } catch (err: unknown) {
    next(new ServiceError(`Failed to set admin claim: ${(err as Error).message || err}`, 'SET_CLAIM_FAILED'));
  }
};

export default { setAdminClaim };
