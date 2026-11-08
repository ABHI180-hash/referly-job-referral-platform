import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: any
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: any[]
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    errors: errors || [],
  };
  return res.status(statusCode).json(response);
};
