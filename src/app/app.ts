import 'express-async-errors';
import bodyParser from 'body-parser';
import {
  globalErrorHandler,
  notFoundErrorHandler,
} from '../middlewares/globalErrorHandler';
import express from 'express';
import { Stripe } from 'stripe';
import dbConnect from '../config/dbConnect';
import userRoutes from '../routes/userRoutes';
import couponRoutes from '../routes/couponRoutes';
import productRoutes from '../routes/productRoutes';
import categoryRoutes from '../routes/categoryRoutes';
import brandRoutes from '../routes/brandRoutes';
import colorRoutes from '../routes/colorRoutes';
import reviewRoutes from '../routes/reviewRoutes';
import orderRoutes from '../routes/orderRoutes';
import morgan = require('morgan');

import env from '../utils/enValidator';
import Order from '../models/Order';
// db connect
dbConnect();
const app = express();
app.use(morgan('dev'));

// stripe webhook

const stripe = new Stripe(env.STRIPE_KEY, {
  apiVersion: '2022-11-15',
});

app.post(
  '/webhook',

  express.raw({ type: 'application/json' }),
  async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig as string,
        env.endpointSecret
      );
    } catch (err: any) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { orderId } = session.metadata as { orderId: string };
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;

      // find the order and update the payment status
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: (totalAmount as number) / 100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        { new: true }
      );
      console.log(order);
    } else {
      return;
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);
// middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// routes

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/colors', colorRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/coupons', couponRoutes);
//err middlewares
app.use(notFoundErrorHandler);
app.use(globalErrorHandler);

export default app;
