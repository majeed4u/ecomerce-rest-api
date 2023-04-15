import createHttpError from 'http-errors';
import asyncHandler from 'express-async-handler';
import { RequestHandler } from 'express';
import Brand, { BrandType } from '../models/Brand';
import mongoose from 'mongoose';

export const createBrand: RequestHandler<unknown, any, BrandType, unknown> =
  asyncHandler(async (req, res, next) => {
    const { name } = req.body;

    // if (image === undefined) {
    //   throw createHttpError(400, 'Image is required');
    // }

    const existingBrand = await Brand.findOne({ name });

    if (existingBrand) {
      throw createHttpError(409, 'Brand already exists');
    }
    const brand = await Brand.create({
      name: name.toLowerCase(),
      user: req.userAuthId,
    });
    res.status(201).json(brand);
  });

export const getAllBrand: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const brands = await Brand.find();
    res.json({
      status: 'success',
      message: 'Brand fetch successfully',
      brands,
    });
  }
);

export const getSingleBrand: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid Brand Id');
    }
    const brand = await Brand.findById(id);
    if (!brand) {
      throw createHttpError(404, 'Brand not found');
    }
    res.json({
      status: 'success',
      message: 'Brand fetch successfully',
      brand,
    });
  }
);

export const updateBrand: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { name } = req.body as BrandType;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid Brand Id');
    }
    const brand = await Brand.findByIdAndUpdate(
      id,
      { name: name },
      { new: true }
    );
    if (!brand) {
      throw createHttpError(404, 'Brand does not exist');
    }

    res.json({
      status: 'success',
      message: 'Brand updated successfully',
      brand,
    });
  }
);
export const deleteBrand: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid Brand Id');
    }
    const brand = await Brand.findById(id);
    if (!brand) {
      throw createHttpError(404, 'Brand not found');
    }
    await brand.deleteOne();
    res.json({
      status: 'success',
      message: 'Brand deleted successfully',
    });
  }
);
