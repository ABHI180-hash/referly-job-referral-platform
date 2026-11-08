import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { ENV } from '../config/environment';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error occurred.';
  let errors = err.errors || [];

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with identifier: ${err.value}`;
  }

  // Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with this ${field} already exists.`;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errors = Object.values(err.errors || {}).map((val: any) => ({
      field: val.path,
      message: val.message,
    }));
    message = 'Validation error occurred while processing entity.';
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token signature.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired. Please sign in again.';
  }

  if (ENV.NODE_ENV !== 'production' && statusCode === 500) {
    console.error('[Internal Error Stack]', err);
  }

  sendError(res, statusCode, message, errors);
};
