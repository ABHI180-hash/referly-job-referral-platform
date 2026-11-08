import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendError } from '../utils/response';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(
      res,
      400,
      'Input validation failed. Please check your submission fields.',
      errors.array()
    );
    return;
  }
  next();
};
