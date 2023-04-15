"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//coupon model
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const CouponSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
        default: 0,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});
//coupon is expired
CouponSchema.virtual('isExpired').get(function () {
    return Date.now() > this.endDate;
});
// days left
CouponSchema.virtual('daysLeft').get(function () {
    const DaysLef = Math.floor((this.endDate - Date.now()) / (1000 * 60 * 60 * 24));
    return `${DaysLef} days left`;
});
// validation
CouponSchema.pre('validate', function (next) {
    if (this.endDate < this.startDate) {
        next(new Error('End date must be greater than start date'));
    }
    next();
});
CouponSchema.pre('validate', function (next) {
    const discount = this.discount;
    if (discount <= 0 || discount > 100) {
        next(new Error('Discount must be between 1 and 100'));
    }
    next();
});
CouponSchema.pre('validate', function (next) {
    if (this.startDate < Date.now()) {
        next(new Error('Start date must be greater than current date'));
    }
    next();
});
CouponSchema.pre('validate', function (next) {
    if (this.endDate < Date.now()) {
        next(new Error('End date must be greater than current date'));
    }
    next();
});
const Coupon = mongoose_1.default.model('Coupon', CouponSchema);
exports.default = Coupon;
