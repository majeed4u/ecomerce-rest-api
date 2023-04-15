import { Request, Response, NextFunction, RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { getToken } from '../utils/getToken';
import { verifyToken } from '../utils/verifyToken';
export const isLoggedN: RequestHandler = (req, res, next) => {
  const token = getToken(req);

  const decodedUser: any = verifyToken(token);
  if (!decodedUser) {
    throw createHttpError(401, 'Invalid/Expires token');
  } else {
    req.userAuthId = decodedUser?.userId;
  }
  next();
};
