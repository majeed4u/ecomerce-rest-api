"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getAllProducts = exports.createProduct = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Product_1 = __importDefault(require("../models/Product"));
const mongoose_1 = __importDefault(require("mongoose"));
const Category_1 = __importDefault(require("../models/Category"));
const Brand_1 = __importDefault(require("../models/Brand"));
exports.createProduct = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, category, sizes, colors, brand, user, images, reviews, price, totalQty, } = req.body;
    const productExist = yield Product_1.default.findOne({ name });
    if (productExist) {
        throw (0, http_errors_1.default)(409, 'Product already exists');
    }
    const existCategory = yield Category_1.default.findOne({ name: category });
    if (!existCategory) {
        throw (0, http_errors_1.default)(404, 'Category not found, please create a new one');
    }
    const existBrand = yield Brand_1.default.findOne({ name: brand });
    if (!existBrand) {
        throw (0, http_errors_1.default)(404, 'Brand not found, please create a new one');
    }
    const product = yield Product_1.default.create({
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
    yield existCategory.save();
    yield existBrand.save();
    res.json({
        status: 'success',
        message: 'Product created successfully',
        product,
    });
}));
exports.getAllProducts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, brand, price, size, color, name } = req.query;
    // query
    let productQuery = Product_1.default.find();
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
    const total = yield Product_1.default.countDocuments();
    productQuery = productQuery.skip(startIndex).limit(limit);
    //   pagination result
    const pagination = {};
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
    const products = yield productQuery.populate('reviews');
    res.json({
        status: 'success',
        total,
        result: products.length,
        pagination,
        message: 'Products fetched successfully',
        products,
    });
}));
exports.getProduct = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw (0, http_errors_1.default)(400, 'Invalid product id');
    }
    const product = yield Product_1.default.findById(id).populate('reviews');
    if (!product || product === null) {
        throw (0, http_errors_1.default)(400, 'Product does not exist');
    }
    else {
        res.json({
            status: 'success',
            message: 'Product retrieved successfully',
            product,
        });
    }
}));
exports.updateProduct = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw (0, http_errors_1.default)(400, 'Invalid product id');
    }
    const { name, description, category, sizes, colors, brand, price, totalQty, } = req.body;
    const product = yield Product_1.default.findById(id);
    if (!product || product === null) {
        throw (0, http_errors_1.default)(400, 'Product does not exist');
    }
    else {
        product.name = name;
        product.description = description;
        product.category = category;
        product.sizes = sizes;
        product.colors = colors;
        product.brand = brand;
        product.price = price;
        product.totalQty = totalQty;
        const updatedProduct = yield product.save();
        res.json({
            status: 'success',
            message: 'Product updated successfully',
            updatedProduct,
        });
    }
}));
exports.deleteProduct = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw (0, http_errors_1.default)(400, 'Invalid product id');
    }
    const product = yield Product_1.default.findByIdAndDelete(id);
    if (!product || product === null) {
        throw (0, http_errors_1.default)(400, 'Product does not exist');
    }
    res.json({
        status: 'success',
        message: 'Product deleted successfully',
        product,
    });
}));
