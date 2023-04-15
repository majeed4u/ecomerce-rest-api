import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import env from './enValidator';
export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });
};
