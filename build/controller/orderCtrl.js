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
exports.getOrderState = exports.updateOrder = exports.getOrder = exports.getAllOrders = exports.createOrder = void 0;
const stripe_1 = __importDefault(require("stripe"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
const Product_1 = __importDefault(require("../models/Product"));
const enValidator_1 = __importDefault(require("../utils/enValidator"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_errors_1 = __importDefault(require("http-errors"));
const Coupon_1 = __importDefault(require("../models/Coupon"));
// strip
const stripe = new stripe_1.default(enValidator_1.default.STRIPE_KEY, {
    apiVersion: '2022-11-15',
});
exports.createOrder = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get coupon
    const { coupon } = req.query;
    // check if coupon exist
    const couponFound = (yield Coupon_1.default.findOne({
        code: coupon,
    }));
    // if is expired
    if (couponFound === null || couponFound === void 0 ? void 0 : couponFound.isExpired) {
        throw new Error('Coupon has expired');
    }
    // if exist
    if (!couponFound) {
        throw new Error('Coupon does not exist');
    }
    // apply discount
    const discount = (couponFound === null || couponFound === void 0 ? void 0 : couponFound.discount) / 100;
    console.log(req.query);
    const { orderItems, shippingAddress, totalPrice } = req.body;
    //Find the user
    const user = yield User_1.default.findById(req.userAuthId);
    //Check if user has shipping address
    if (!(user === null || user === void 0 ? void 0 : user.hasShippingAddress)) {
        throw new Error('Please provide shipping address');
    }
    // validate shipping address
    // if (!shippingAddress) {
    //   throw createHttpError(400, 'Shipping address cannot be empty');
    // }
    //Check if order is not empty
    if ((orderItems === null || orderItems === void 0 ? void 0 : orderItems.length) <= 0) {
        throw new Error('No Order Items');
    }
    //Place/create order - save into DB
    const order = yield Order_1.default.create({
        user: user === null || user === void 0 ? void 0 : user._id,
        orderItems,
        shippingAddress,
        // totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
        totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
    });
    console.log(order);
    //Update the product qty
    const products = yield Product_1.default.find({ _id: { $in: orderItems } });
    orderItems === null || orderItems === void 0 ? void 0 : orderItems.map((order) => __awaiter(void 0, void 0, void 0, function* () {
        const product = products === null || products === void 0 ? void 0 : products.find((product) => {
            var _a, _b;
            return ((_a = product === null || product === void 0 ? void 0 : product._id) === null || _a === void 0 ? void 0 : _a.toString()) === ((_b = order === null || order === void 0 ? void 0 : order._id) === null || _b === void 0 ? void 0 : _b.toString());
        });
        if (product) {
            product.totalSold += order.qty;
        }
        yield product.save();
    }));
    //push order into user
    user.orders.push(order === null || order === void 0 ? void 0 : order._id);
    yield user.save();
    // make payment (strip payment)
    const convertedOrder = orderItems === null || orderItems === void 0 ? void 0 : orderItems.map((item) => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item === null || item === void 0 ? void 0 : item.name,
                    description: item === null || item === void 0 ? void 0 : item.description,
                },
                unit_amount: (item === null || item === void 0 ? void 0 : item.price) * 100,
            },
            quantity: item === null || item === void 0 ? void 0 : item.qty,
        };
    });
    const session = yield stripe.checkout.sessions.create({
        line_items: convertedOrder,
        metadata: {
            orderId: JSON.stringify(order === null || order === void 0 ? void 0 : order._id),
        },
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
    });
    res.send({ url: session.url });
    // payment webhook
    // update the user's order
    // res.status(201).json({ order, user });
}));
exports.getAllOrders = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield Order_1.default.find();
    if (order.length === 0) {
        throw (0, http_errors_1.default)(400, 'No Order found');
    }
    res.json({
        status: 'success',
        message: 'Orders fetched successfully',
        order,
    });
}));
exports.getOrder = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid Order type');
    }
    const order = yield Order_1.default.findById(id).exec();
    if (!order) {
        throw new Error('No Order found');
    }
    res.json({ status: 'success', message: 'Order fetch successfully', order });
}));
exports.updateOrder = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid Order type');
    }
    const updatedOrder = yield Order_1.default.findByIdAndUpdate(id, {
        status,
    }, { new: true });
    if (!exports.updateOrder) {
        throw new Error('No Order found');
    }
    res.json({
        status: 'success',
        message: 'order updated successfully',
        updatedOrder,
    });
}));
//
exports.getOrderState = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_1.default.aggregate([
        {
            $group: {
                _id: null,
                minimumSale: { $min: '$totalPrice' },
                totalSales: { $sum: '$totalPrice' },
                maximumSale: { $max: '$totalPrice' },
                avgSale: { $avg: '$totalPrice' },
            },
        },
    ]);
    // get today'
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todaySales = yield Order_1.default.aggregate([
        {
            $match: { createdAt: { $gte: today } },
        },
        {
            $group: {
                _id: null,
                totalSales: { $sum: '$totalPrice' },
            },
        },
    ]);
    res.json({
        status: 'success',
        message: 'Sales fetched successfully',
        orders,
        todaySales,
    });
}));
