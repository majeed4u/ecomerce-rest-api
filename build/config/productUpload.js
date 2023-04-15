"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("cloudinary"));
const enValidator_1 = __importDefault(require("../utils/enValidator"));
const cloudinary = cloudinary_1.default.v2;
// configure cloudinary
cloudinary.config({
    cloud_name: enValidator_1.default.CLOUDINARY_CLOUD_NAME,
    api_key: enValidator_1.default.CLOUDINARY_API_KEY,
    api_secret: enValidator_1.default.CLOUDINARY_SECRET_KEY,
});
// create storage engine with options
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Ecommerce-api',
        allowedFormats: ['jpg', 'png', 'jpeg'],
    },
});
const upload = (0, multer_1.default)({
    storage,
});
exports.default = upload;
