import createHttpError from 'http-errors';
import asyncHandler from 'express-async-handler';
import { RequestHandler } from 'express';
import Category, { CategoryTypes } from '../models/Category';
import mongoose from 'mongoose';
import { ProductId } from '../types/ProductTypes';

export const createCategory: RequestHandler<
  unknown,
  any,
  CategoryTypes,
  unknown
> = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // if (image === undefined) {
  //   throw createHttpError(400, 'Image is required');
  // }

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw createHttpError(409, 'Category already exists');
  }
  const newCategory = await Category.create({
    name: name,
    user: req.userAuthId,
    image: req.file?.path,
  });
  res.status(201).json(newCategory);
});

export const getAllCategories: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const categories = await Category.find();
    res.json({
      status: 'success',
      message: 'Category fetch successfully',
      categories,
    });
  }
);

export const getSingleCategory: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid Category Id');
    }
    const category = await Category.findById(id);
    if (!category) {
      throw createHttpError(404, 'Category not found');
    }
    res.json({
      status: 'success',
      message: 'Category fetch successfully',
      category,
    });
  }
);

export const updateCategory: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { name } = req.body as CategoryTypes;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid Category Id');
    }
    const category = await Category.findByIdAndUpdate(
      id,
      { name: name },
      { new: true }
    );
    if (!category) {
      throw createHttpError(404, 'Category does not exist');
    }

    res.json({
      status: 'success',
      message: 'Category updated successfully',
      category,
    });
  }
);
export const deleteCategory: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid Category Id');
    }
    const category = await Category.findById(id);
    if (!category) {
      throw createHttpError(404, 'Category not found');
    }
    await category.deleteOne();
    res.json({
      status: 'success',
      message: 'Category deleted successfully',
    });
  }
);
