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
exports.deleteCoupons = exports.updateCoupons = exports.getCoupon = exports.getCoupons = exports.createCoupon = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Coupon_1 = __importDefault(require("../models/Coupon"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.createCoupon = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, startDate, endDate, discount, user } = req.body;
    // check if admin
    // check if coupon exist
    const couponExist = yield Coupon_1.default.findOne({
        code,
    });
    if (couponExist) {
        throw new Error('Coupon already exist');
    }
    // check if coupon is a number
    if (isNaN(discount)) {
        throw new Error('Discount must be a number');
    }
    // create coupon
    const coupon = yield Coupon_1.default.create({
        code: code.toUpperCase(),
        startDate,
        endDate,
        discount,
        user: req.userAuthId,
    });
    res.json({
        status: 'success',
        message: 'Coupon created successfully',
        coupon,
    });
}));
exports.getCoupons = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check if admin
    const coupons = yield Coupon_1.default.find({});
    if (!coupons) {
        throw new Error('No coupons found');
    }
    res.json({
        status: 'success',
        message: 'Coupons fetched successfully',
        coupons,
    });
}));
exports.getCoupon = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('invalid requested coupon');
    }
    // check if admin
    const coupons = yield Coupon_1.default.findById(id);
    if (!coupons) {
        throw new Error('No coupons found');
    }
    res.json({
        status: 'success',
        message: 'Coupons fetched successfully',
        coupons,
    });
}));
exports.updateCoupons = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { code, startDate, endDate, discount } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('invalid requested coupon');
    }
    const coupon = yield Coupon_1.default.findByIdAndUpdate(id, {
        code: code === null || code === void 0 ? void 0 : code.toUpperCase(),
        startDate: startDate,
        endDate: endDate,
        discount: discount,
    });
    if (!coupon) {
        throw new Error('coupon not found');
    }
    res.json({
        status: 'success',
        message: 'coupon updated successfully',
        coupon,
    });
}));
exports.deleteCoupons = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('invalid Id');
    }
    const coupons = yield Coupon_1.default.findByIdAndDelete(id);
    if (!coupons) {
        throw new Error('No coupons found');
    }
    res.json({
        status: 'success',
        message: 'Coupons fetched successfully',
    });
}));
