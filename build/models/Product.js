"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//product schema
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        ref: 'Category',
        required: true,
    },
    sizes: {
        type: [String],
        enum: ['S', 'M', 'L', 'XL', 'XXL'],
        required: true,
    },
    colors: {
        type: [String],
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    images: [
        {
            type: String,
            required: true,
        },
    ],
    reviews: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
    price: {
        type: Number,
        required: true,
    },
    totalQty: {
        type: Number,
        required: true,
    },
    totalSold: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});
//Virtuals
//qty left
ProductSchema.virtual('totalReviews').get(function () {
    var _a;
    const product = this;
    return (_a = product === null || product === void 0 ? void 0 : product.reviews) === null || _a === void 0 ? void 0 : _a.length;
});
// avg rating
// ProductSchema.virtual('averageRating').get(function () {
//   let totalRating = 0;
//   const product = this;
//   product?.reviews?.forEach((review: any) => {
//     totalRating += review.rating;
//   });
//   return totalRating / product?.reviews?.length;
// });
ProductSchema.virtual('averageRating').get(function () {
    var _a, _b;
    const product = this;
    const totalRating = (_a = product === null || product === void 0 ? void 0 : product.reviews) === null || _a === void 0 ? void 0 : _a.reduce((acc, review) => {
        return acc + review.rating;
    }, 0);
    return Number(totalRating / ((_b = product === null || product === void 0 ? void 0 : product.reviews) === null || _b === void 0 ? void 0 : _b.length)).toFixed(1);
});
// total qty left
ProductSchema.virtual('qtyLeft').get(function () {
    const product = this;
    return product.totalQty - product.totalSold;
});
const Product = mongoose_1.default.model('Product', ProductSchema);
exports.default = Product;
