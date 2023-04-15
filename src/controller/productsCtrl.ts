import createHttpError from 'http-errors';
import { ProductId, ProductQuery, ProductTypes } from '../types/ProductTypes';
import asyncHandler from 'express-async-handler';
import { RequestHandler } from 'express';
import Product from '../models/Product';
import mongoose from 'mongoose';
import Category from '../models/Category';
import Brand from '../models/Brand';
export const createProduct: RequestHandler<
  unknown,
  unknown,
  ProductTypes,
  unknown
> = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    brand,
    user,
    images,
    reviews,
    price,
    totalQty,
  } = req.body;
  const productExist = await Product.findOne({ name });
  if (productExist) {
    throw createHttpError(409, 'Product already exists');
  }
  const existCategory = await Category.findOne({ name: category });
  if (!existCategory) {
    throw createHttpError(404, 'Category not found, please create a new one');
  }
  const existBrand = await Brand.findOne({ name: brand });
  if (!existBrand) {
    throw createHttpError(404, 'Brand not found, please create a new one');
  }

  const product = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    images,
    reviews,
    brand,
    price,
    totalQty,
  });
  //   push product into category
  existCategory.products.push(product._id);
  existBrand.products.push(product._id);
  // save product into category
  await existCategory.save();
  await existBrand.save();

  res.json({
    status: 'success',
    message: 'Product created successfully',
    product,
  });
});

export const getAllProducts: RequestHandler<
  unknown,
  unknown,
  ProductTypes,
  ProductQuery
> = asyncHandler(async (req, res, next) => {
  const { category, brand, price, size, color, name } = req.query;

  // query
  let productQuery = Product.find();

  //    search products by name
  if (name) {
    productQuery = productQuery.find({
      name: { $regex: name, $options: 'i' },
    });
  }

  //    search products by category
  if (category) {
    productQuery = productQuery.find({
      category: { $regex: category, $options: 'i' },
    });
  }

  if (brand) {
    productQuery = productQuery.find({
      brand: { $regex: brand, $options: 'i' },
    });
  }

  //    filter by color
  if (color) {
    productQuery = productQuery.find({
      colors: { $regex: color, $options: 'i' },
    });
  }
  //   filter by size
  if (size) {
    productQuery = productQuery.find({
      sizes: { $regex: size, $options: 'i' },
    });
  }

  //   sort by price

  if (price) {
    const priceRange = price.split('-');
    //   gte = greater than or equal to
    //   lte = less than or equal to
    productQuery = productQuery.find({
      price: {
        $gte: Number(priceRange[0]),
        $lte: Number(priceRange[1]),
      },
    });
  }
  //  pagination
  // page
  const page = Number(req.query.page) || 1;
  // limit
  const limit = Number(req.query.limit) || 10;
  // startIndex
  const startIndex = (page - 1) * limit;
  // endindex
  const endIndex = page * limit;
  // total records per page
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  //   pagination result
  const pagination: any = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  const products = await productQuery.populate('reviews');
  res.json({
    status: 'success',
    total,
    result: products.length,
    pagination,
    message: 'Products fetched successfully',
    products,
  });
});
export const getProduct: RequestHandler<ProductId, unknown, unknown, unknown> =
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid product id');
    }

    const product = await Product.findById(id).populate('reviews');

    if (!product || product === null) {
      throw createHttpError(400, 'Product does not exist');
    } else {
      res.json({
        status: 'success',
        message: 'Product retrieved successfully',
        product,
      });
    }
  });
export const updateProduct: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid product id');
    }
    const {
      name,
      description,
      category,
      sizes,
      colors,
      brand,
      price,
      totalQty,
    } = req.body as ProductTypes;

    const product = await Product.findById(id);

    if (!product || product === null) {
      throw createHttpError(400, 'Product does not exist');
    } else {
      product.name = name as string;
      product.description = description as string;
      product.category = category as string;
      product.sizes = sizes as string[];
      product.colors = colors as string[];
      product.brand = brand as string;
      product.price = price as number;
      product.totalQty = totalQty as number;
      const updatedProduct = await product.save();
      res.json({
        status: 'success',
        message: 'Product updated successfully',
        updatedProduct,
      });
    }
  }
);
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, 'Invalid product id');
  }
  const product = await Product.findByIdAndDelete(id);

  if (!product || product === null) {
    throw createHttpError(400, 'Product does not exist');
  }
  res.json({
    status: 'success',
    message: 'Product deleted successfully',
    product,
  });
});
