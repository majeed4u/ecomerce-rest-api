import createHttpError from 'http-errors';
import asyncHandler from 'express-async-handler';
import { RequestHandler } from 'express';
import Color, { ColorType } from '../models/Color';
import mongoose from 'mongoose';

export const createColor: RequestHandler<unknown, any, ColorType, unknown> =
  asyncHandler(async (req, res, next) => {
    const { name } = req.body;

    // if (image === undefined) {
    //   throw createHttpError(400, 'Image is required');
    // }

    const existingColor = await Color.findOne({ name });

    if (existingColor) {
      throw createHttpError(409, 'Color already exists');
    }
    const color = await Color.create({
      name: name.toLowerCase(),
      user: req.userAuthId,
    });
    res.status(201).json(color);
  });

export const getAllColors: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const colors = await Color.find();
    res.json({
      status: 'success',
      message: 'Color fetch successfully',
      colors,
    });
  }
);

export const getSingleColor: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid Color Id');
    }
    const color = await Color.findById(id);
    if (!color) {
      throw createHttpError(404, 'Color not found');
    }
    res.json({
      status: 'success',
      message: 'Color fetch successfully',
      color,
    });
  }
);

export const updateColor: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { name } = req.body as ColorType;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid Color Id');
    }
    const color = await Color.findByIdAndUpdate(
      id,
      { name: name },
      { new: true }
    );
    if (!color) {
      throw createHttpError(404, 'Color does not exist');
    }

    res.json({
      status: 'success',
      message: 'Color updated successfully',
      color,
    });
  }
);
export const deleteColor: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid Color Id');
    }
    const color = await Color.findById(id);
    if (!color) {
      throw createHttpError(404, 'Color not found');
    }
    await color.deleteOne();
    res.json({
      status: 'success',
      message: 'Color deleted successfully',
    });
  }
);
