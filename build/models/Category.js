"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//category schema
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    products: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
}, { timestamps: true });
const Category = mongoose_1.default.model('Category', CategorySchema);
exports.default = Category;
