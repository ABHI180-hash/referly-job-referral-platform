import jwt from 'jsonwebtoken';
import { ENV } from '../config/environment';
import { AuthUserPayload } from '../types';

export const generateTokens = (payload: AuthUserPayload) => {
  const accessToken = jwt.sign(payload, ENV.JWT_ACCESS_SECRET, {
    expiresIn: ENV.JWT_ACCESS_EXPIRES_IN as any,
  });

  const refreshToken = jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as any,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): AuthUserPayload => {
  return jwt.verify(token, ENV.JWT_ACCESS_SECRET) as AuthUserPayload;
};

export const verifyRefreshToken = (token: string): AuthUserPayload => {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as AuthUserPayload;
};
