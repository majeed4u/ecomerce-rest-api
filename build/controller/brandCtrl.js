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
exports.deleteBrand = exports.updateBrand = exports.getSingleBrand = exports.getAllBrand = exports.createBrand = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Brand_1 = __importDefault(require("../models/Brand"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.createBrand = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    // if (image === undefined) {
    //   throw createHttpError(400, 'Image is required');
    // }
    const existingBrand = yield Brand_1.default.findOne({ name });
    if (existingBrand) {
        throw (0, http_errors_1.default)(409, 'Brand already exists');
    }
    const brand = yield Brand_1.default.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });
    res.status(201).json(brand);
}));
exports.getAllBrand = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const brands = yield Brand_1.default.find();
    res.json({
        status: 'success',
        message: 'Brand fetch successfully',
        brands,
    });
}));
exports.getSingleBrand = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw (0, http_errors_1.default)(400, 'Invalid Brand Id');
    }
    const brand = yield Brand_1.default.findById(id);
    if (!brand) {
        throw (0, http_errors_1.default)(404, 'Brand not found');
    }
    res.json({
        status: 'success',
        message: 'Brand fetch successfully',
        brand,
    });
}));
exports.updateBrand = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw (0, http_errors_1.default)(400, 'Invalid Brand Id');
    }
    const brand = yield Brand_1.default.findByIdAndUpdate(id, { name: name }, { new: true });
    if (!brand) {
        throw (0, http_errors_1.default)(404, 'Brand does not exist');
    }
    res.json({
        status: 'success',
        message: 'Brand updated successfully',
        brand,
    });
}));
exports.deleteBrand = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw (0, http_errors_1.default)(400, 'Invalid Brand Id');
    }
    const brand = yield Brand_1.default.findById(id);
    if (!brand) {
        throw (0, http_errors_1.default)(404, 'Brand not found');
    }
    yield brand.deleteOne();
    res.json({
        status: 'success',
        message: 'Brand deleted successfully',
    });
}));
