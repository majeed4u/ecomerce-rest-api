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
exports.deleteCategory = exports.updateCategory = exports.getSingleCategory = exports.getAllCategories = exports.createCategory = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Category_1 = __importDefault(require("../models/Category"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.createCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name } = req.body;
    // if (image === undefined) {
    //   throw createHttpError(400, 'Image is required');
    // }
    const existingCategory = yield Category_1.default.findOne({ name });
    if (existingCategory) {
        throw (0, http_errors_1.default)(409, 'Category already exists');
    }
    const newCategory = yield Category_1.default.create({
        name: name,
        user: req.userAuthId,
        image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path,
    });
    res.status(201).json(newCategory);
}));
exports.getAllCategories = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield Category_1.default.find();
    res.json({
        status: 'success',
        message: 'Category fetch successfully',
        categories,
    });
}));
exports.getSingleCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw (0, http_errors_1.default)(400, 'Invalid Category Id');
    }
    const category = yield Category_1.default.findById(id);
    if (!category) {
        throw (0, http_errors_1.default)(404, 'Category not found');
    }
    res.json({
        status: 'success',
        message: 'Category fetch successfully',
        category,
    });
}));
exports.updateCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw (0, http_errors_1.default)(400, 'Invalid Category Id');
    }
    const category = yield Category_1.default.findByIdAndUpdate(id, { name: name }, { new: true });
    if (!category) {
        throw (0, http_errors_1.default)(404, 'Category does not exist');
    }
    res.json({
        status: 'success',
        message: 'Category updated successfully',
        category,
    });
}));
exports.deleteCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw (0, http_errors_1.default)(400, 'Invalid Category Id');
    }
    const category = yield Category_1.default.findById(id);
    if (!category) {
        throw (0, http_errors_1.default)(404, 'Category not found');
    }
    yield category.deleteOne();
    res.json({
        status: 'success',
        message: 'Category deleted successfully',
    });
}));
