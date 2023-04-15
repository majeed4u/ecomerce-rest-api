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
exports.deleteColor = exports.updateColor = exports.getSingleColor = exports.getAllColors = exports.createColor = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Color_1 = __importDefault(require("../models/Color"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.createColor = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    // if (image === undefined) {
    //   throw createHttpError(400, 'Image is required');
    // }
    const existingColor = yield Color_1.default.findOne({ name });
    if (existingColor) {
        throw (0, http_errors_1.default)(409, 'Color already exists');
    }
    const color = yield Color_1.default.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });
    res.status(201).json(color);
}));
exports.getAllColors = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const colors = yield Color_1.default.find();
    res.json({
        status: 'success',
        message: 'Color fetch successfully',
        colors,
    });
}));
exports.getSingleColor = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw (0, http_errors_1.default)(400, 'Invalid Color Id');
    }
    const color = yield Color_1.default.findById(id);
    if (!color) {
        throw (0, http_errors_1.default)(404, 'Color not found');
    }
    res.json({
        status: 'success',
        message: 'Color fetch successfully',
        color,
    });
}));
exports.updateColor = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw (0, http_errors_1.default)(400, 'Invalid Color Id');
    }
    const color = yield Color_1.default.findByIdAndUpdate(id, { name: name }, { new: true });
    if (!color) {
        throw (0, http_errors_1.default)(404, 'Color does not exist');
    }
    res.json({
        status: 'success',
        message: 'Color updated successfully',
        color,
    });
}));
exports.deleteColor = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw (0, http_errors_1.default)(400, 'Invalid Color Id');
    }
    const color = yield Color_1.default.findById(id);
    if (!color) {
        throw (0, http_errors_1.default)(404, 'Color not found');
    }
    yield color.deleteOne();
    res.json({
        status: 'success',
        message: 'Color deleted successfully',
    });
}));
