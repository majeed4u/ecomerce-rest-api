import Stripe from 'stripe';
import asyncHandler from 'express-async-handler';
import Order, { OrderTypes } from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';
import env from '../utils/enValidator';
import { response } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import Coupon, { CouponInput } from '../models/Coupon';

// strip
const stripe = new Stripe(env.STRIPE_KEY, {
  apiVersion: '2022-11-15',
});
export const createOrder = asyncHandler(async (req, res, next) => {
  // get coupon
  const { coupon } = req.query;
  // check if coupon exist
  const couponFound = (await Coupon.findOne({
    code: coupon,
  })) as Partial<CouponInput>;
  // if is expired
  if (couponFound?.isExpired) {
    throw new Error('Coupon has expired');
  }
  // if exist
  if (!couponFound) {
    throw new Error('Coupon does not exist');
  }
  // apply discount

  const discount = (couponFound?.discount as number) / 100;
  console.log(req.query);
  const { orderItems, shippingAddress, totalPrice } = req.body as OrderTypes;

  //Find the user
  const user = await User.findById(req.userAuthId);
  //Check if user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error('Please provide shipping address');
  }
  // validate shipping address
  // if (!shippingAddress) {
  //   throw createHttpError(400, 'Shipping address cannot be empty');
  // }

  //Check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error('No Order Items');
  }
  //Place/create order - save into DB
  const order: any = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    // totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
    totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
  });
  console.log(order);
  //Update the product qty
  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (order) => {
    const product: any = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });
  //push order into user
  user.orders.push(order?._id);
  await user.save();
  // make payment (strip payment)
  const convertedOrder = orderItems?.map((item) => {
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrder,

    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel',
  });
  res.send({ url: session.url });

  // payment webhook

  // update the user's order

  // res.status(201).json({ order, user });
});

export const getAllOrders = asyncHandler(async (req, res, next) => {
  const order = await Order.find();

  if (order.length === 0) {
    throw createHttpError(400, 'No Order found');
  }

  res.json({
    status: 'success',
    message: 'Orders fetched successfully',
    order,
  });
});
export const getOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params as Pick<OrderTypes, 'id'>;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid Order type');
  }
  const order = await Order.findById(id).exec();
  if (!order) {
    throw new Error('No Order found');
  }

  res.json({ status: 'success', message: 'Order fetch successfully', order });
});
export const updateOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params as Pick<OrderTypes, 'id'>;
  const { status } = req.body as Omit<OrderTypes, 'id'>;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid Order type');
  }
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status,
    },
    { new: true }
  );
  if (!updateOrder) {
    throw new Error('No Order found');
  }
  res.json({
    status: 'success',
    message: 'order updated successfully',
    updatedOrder,
  });
});
//

export const getOrderState = asyncHandler(async (req, res, next) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: { $min: '$totalPrice' },
        totalSales: { $sum: '$totalPrice' },
        maximumSale: { $max: '$totalPrice' },
        avgSale: { $avg: '$totalPrice' },
      },
    },
  ]);

  // get today'
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todaySales = await Order.aggregate([
    {
      $match: { createdAt: { $gte: today } },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);
  res.json({
    status: 'success',
    message: 'Sales fetched successfully',
    orders,
    todaySales,
  });
});
