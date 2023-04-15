import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import env from './enValidator';
type UserId = mongoose.Types.ObjectId;
const generateToken = (userId: UserId) => {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: env.JWT_LIFE });
};

export default generateToken;
