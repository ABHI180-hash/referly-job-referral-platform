import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types';
import { sendError } from '../utils/response';

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, 'Unauthorized request: authentication required.');
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        403,
        `Forbidden access: role '${req.user.role}' is not authorized for this resource.`
      );
      return;
    }

    next();
  };
};
