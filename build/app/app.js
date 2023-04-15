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
require("express-async-errors");
const body_parser_1 = __importDefault(require("body-parser"));
const globalErrorHandler_1 = require("../middlewares/globalErrorHandler");
const express_1 = __importDefault(require("express"));
const stripe_1 = require("stripe");
const dbConnect_1 = __importDefault(require("../config/dbConnect"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const couponRoutes_1 = __importDefault(require("../routes/couponRoutes"));
const productRoutes_1 = __importDefault(require("../routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("../routes/categoryRoutes"));
const brandRoutes_1 = __importDefault(require("../routes/brandRoutes"));
const colorRoutes_1 = __importDefault(require("../routes/colorRoutes"));
const reviewRoutes_1 = __importDefault(require("../routes/reviewRoutes"));
const orderRoutes_1 = __importDefault(require("../routes/orderRoutes"));
const morgan = require("morgan");
const enValidator_1 = __importDefault(require("../utils/enValidator"));
const Order_1 = __importDefault(require("../models/Order"));
// db connect
(0, dbConnect_1.default)();
const app = (0, express_1.default)();
app.use(morgan('dev'));
// stripe webhook
const stripe = new stripe_1.Stripe(enValidator_1.default.STRIPE_KEY, {
    apiVersion: '2022-11-15',
});
app.post('/webhook', express_1.default.raw({ type: 'application/json' }), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, enValidator_1.default.endpointSecret);
    }
    catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { orderId } = session.metadata;
        const paymentStatus = session.payment_status;
        const paymentMethod = session.payment_method_types[0];
        const totalAmount = session.amount_total;
        const currency = session.currency;
        // find the order and update the payment status
        const order = yield Order_1.default.findByIdAndUpdate(JSON.parse(orderId), {
            totalPrice: totalAmount / 100,
            currency,
            paymentMethod,
            paymentStatus,
        }, { new: true });
        console.log(order);
    }
    else {
        return;
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
}));
// middlewares
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// routes
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/products', productRoutes_1.default);
app.use('/api/v1/categories', categoryRoutes_1.default);
app.use('/api/v1/brands', brandRoutes_1.default);
app.use('/api/v1/colors', colorRoutes_1.default);
app.use('/api/v1/reviews', reviewRoutes_1.default);
app.use('/api/v1/orders', orderRoutes_1.default);
app.use('/api/v1/coupons', couponRoutes_1.default);
//err middlewares
app.use(globalErrorHandler_1.notFoundErrorHandler);
app.use(globalErrorHandler_1.globalErrorHandler);
exports.default = app;
