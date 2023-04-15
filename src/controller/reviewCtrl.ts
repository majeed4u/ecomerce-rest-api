import asyncHandler from 'express-async-handler';
import { RequestHandler } from 'express';
import Review, { ReviewProductId, ReviewType } from '../models/Review';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import Product from '../models/Product';
export const createReview: RequestHandler = asyncHandler(
  async (req, res, next) => {
    // find product by id
    const { productId } = req.params;
    const { message, rating } = req.body as ReviewType;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw createHttpError(400, 'Invalid product id');
    }

    const productFound = await Product.findById(productId).populate('reviews');
    if (!productFound) {
      throw createHttpError(404, 'Product not found');
    }

    const hasReview = productFound?.reviews?.find((review: any) => {
      return review.user.toString() === req.userAuthId.toString();
    });

    if (hasReview) {
      throw createHttpError(400, 'You already reviewed this product');
    }
    const review = await Review.create({
      message: message,
      rating: rating,
      product: productFound?._id,
      user: req.userAuthId,
    });
    productFound.reviews.push(review._id);
    await productFound.save();
    res.json({
      status: 'success',
      message: 'Review created successfully',
    });
  }
);
export const getAllReviews: RequestHandler = asyncHandler(
  async (req, res, next) => {
    res.json({
      status: 'success',
      message: 'Reviews retrieved successfully',
    });
  }
);
export const getReview: RequestHandler = asyncHandler(
  async (req, res, next) => {
    res.json({
      status: 'success',
      message: 'Review retrieved successfully',
    });
  }
);
export const updateReview: RequestHandler = asyncHandler(
  async (req, res, next) => {
    res.json({
      status: 'success',
      message: 'Review updated successfully',
    });
  }
);
export const deleteReview: RequestHandler = asyncHandler(
  async (req, res, next) => {
    res.json({
      status: 'success',
      message: 'Review deleted successfully',
    });
  }
);
