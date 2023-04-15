"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
//Generate random numbers for order
const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNumbers = Math.floor(1000 + Math.random() * 90000);
const OrderSchema = new Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderItems: [
        {
            type: Object,
            required: true,
        },
    ],
    shippingAddress: {
        type: Object,
        required: true,
    },
    orderNumber: {
        type: String,
        default: randomTxt + randomNumbers,
    },
    //for stripe payment
    paymentStatus: {
        type: String,
        default: 'Not paid',
    },
    paymentMethod: {
        type: String,
        default: 'Not specified',
    },
    totalPrice: {
        type: Number,
        default: 0.0,
    },
    currency: {
        type: String,
        default: 'Not specified',
    },
    //For admin
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'processing', 'shipped', 'delivered'],
    },
    deliveredAt: {
        type: Date,
    },
}, {
    timestamps: true,
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },
    // id: false,
});
const Order = mongoose_1.default.model('Order', OrderSchema);
// validate shipping address
exports.default = Order;
