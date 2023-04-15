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
exports.deleteReview = exports.updateReview = exports.getReview = exports.getAllReviews = exports.createReview = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Review_1 = __importDefault(require("../models/Review"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_errors_1 = __importDefault(require("http-errors"));
const Product_1 = __importDefault(require("../models/Product"));
exports.createReview = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // find product by id
    const { productId } = req.params;
    const { message, rating } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
        throw (0, http_errors_1.default)(400, 'Invalid product id');
    }
    const productFound = yield Product_1.default.findById(productId).populate('reviews');
    if (!productFound) {
        throw (0, http_errors_1.default)(404, 'Product not found');
    }
    const hasReview = (_a = productFound === null || productFound === void 0 ? void 0 : productFound.reviews) === null || _a === void 0 ? void 0 : _a.find((review) => {
        return review.user.toString() === req.userAuthId.toString();
    });
    if (hasReview) {
        throw (0, http_errors_1.default)(400, 'You already reviewed this product');
    }
    const review = yield Review_1.default.create({
        message: message,
        rating: rating,
        product: productFound === null || productFound === void 0 ? void 0 : productFound._id,
        user: req.userAuthId,
    });
    productFound.reviews.push(review._id);
    yield productFound.save();
    res.json({
        status: 'success',
        message: 'Review created successfully',
    });
}));
exports.getAllReviews = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        status: 'success',
        message: 'Reviews retrieved successfully',
    });
}));
exports.getReview = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        status: 'success',
        message: 'Review retrieved successfully',
    });
}));
exports.updateReview = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        status: 'success',
        message: 'Review updated successfully',
    });
}));
exports.deleteReview = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        status: 'success',
        message: 'Review deleted successfully',
    });
}));
