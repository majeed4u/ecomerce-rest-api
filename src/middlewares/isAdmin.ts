import { NextFunction, Request, Response } from 'express';
import User from '../models/User';

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  // find the login user

  const user = await User.findById(req.userAuthId);
  //   check if admin
  if (user?.isAdmin) {
    next();
  } else {
    next(new Error('Access denied ,admin only'));
  }
};

export default isAdmin;
