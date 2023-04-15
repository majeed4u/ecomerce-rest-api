import asyncHandler from 'express-async-handler';
import Coupon, { CouponInput } from '../models/Coupon';
import mongoose from 'mongoose';

export const createCoupon = asyncHandler<{}, {}, CouponInput, {}>(
  async (req, res) => {
    const { code, startDate, endDate, discount, user } = req.body;
    // check if admin
    // check if coupon exist

    const couponExist = await Coupon.findOne({
      code,
    });
    if (couponExist) {
      throw new Error('Coupon already exist');
    }

    // check if coupon is a number
    if (isNaN(discount)) {
      throw new Error('Discount must be a number');
    }

    // create coupon
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      startDate,
      endDate,
      discount,
      user: req.userAuthId,
    });

    res.json({
      status: 'success',
      message: 'Coupon created successfully',
      coupon,
    });
  }
);

export const getCoupons = asyncHandler<{}, {}, {}, {}>(async (req, res) => {
  // check if admin
  const coupons = await Coupon.find({});
  if (!coupons) {
    throw new Error('No coupons found');
  }
  res.json({
    status: 'success',
    message: 'Coupons fetched successfully',
    coupons,
  });
});

export const getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('invalid requested coupon');
  }
  // check if admin
  const coupons = await Coupon.findById(id);
  if (!coupons) {
    throw new Error('No coupons found');
  }
  res.json({
    status: 'success',
    message: 'Coupons fetched successfully',
    coupons,
  });
});

export const updateCoupons = asyncHandler<
  Pick<CouponInput, 'id'>,
  {},
  Omit<CouponInput, 'id'>,
  {}
>(async (req, res) => {
  const { id } = req.params;
  const { code, startDate, endDate, discount } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('invalid requested coupon');
  }
  const coupon = await Coupon.findByIdAndUpdate(id, {
    code: code?.toUpperCase(),
    startDate: startDate,
    endDate: endDate,
    discount: discount,
  });
  if (!coupon) {
    throw new Error('coupon not found');
  }

  res.json({
    status: 'success',
    message: 'coupon updated successfully',
    coupon,
  });
});
export const deleteCoupons = asyncHandler<Pick<CouponInput, 'id'>, {}, {}, {}>(
  async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('invalid Id');
    }

    const coupons = await Coupon.findByIdAndDelete(id);
    if (!coupons) {
      throw new Error('No coupons found');
    }
    res.json({
      status: 'success',
      message: 'Coupons fetched successfully',
    });
  }
);
