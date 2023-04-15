import { RequestHandler } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';

import generateToken from '../utils/generateToken';
import { getToken } from '../utils/getToken';
import { verifyToken } from '../utils/verifyToken';
import mongoose from 'mongoose';
export const registerUser: RequestHandler<
  unknown,
  unknown,
  UserSignup,
  unknown
> = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    // throw an error

    throw createHttpError(400, 'please provide all values');
  }

  const userExist = await User.findOne({ email: email }).exec();
  if (userExist) {
    // throw error
    throw createHttpError(409, 'User already exists');
  }
  // has password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // create new user
  const newUser = await User.create({
    fullName: fullName,
    email: email,
    password: hashedPassword,
  });
  // toekn

  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: newUser,
  });
});

export const loginUser: RequestHandler<unknown, unknown, UserLogin, unknown> =
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const userFound = await User.findOne({ email: email }).exec();
    if (userFound && (await bcrypt.compare(password, userFound.password))) {
      res.json({
        status: 'Success',
        msg: 'Login Success',
        userFound,
        token: generateToken(userFound._id),
      });
    } else {
      throw createHttpError(401, 'Invalid credentials');
    }
  });

export const getUserProfile: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const user = await User.findById(req.userAuthId).populate('orders');
    console.log(user);
    res.json({
      status: 'success',
      message: 'Profile fetched Successfully',
      user,
    });
  }
);

// updating shipping address
export const updateShippingAddress = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    country,
    province,
    phoneNumber,
  } = req.body as UserShippingAddressType;
  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      hasShippingAddress: true,
      ShippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        country,
        province,
        phoneNumber,
      },
    },
    { new: true }
  );
  console.log(user);
  if (!user) {
    throw createHttpError(404, 'User not found');
  } else {
    await user.save();
    res.json({
      status: 'success',
      message: 'Shipping address updated successfully',
      user: user,
    });
  }
});

interface UserShippingAddressType extends mongoose.Document {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  province: string;
  phoneNumber: string;
}
interface UserSignup extends mongoose.Document {
  fullName: string;
  email: string;
  password: string;
}

interface UserLogin extends mongoose.Document {
  email: string;
  password: string;
}
