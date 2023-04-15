import mongoose, { InferSchemaType } from 'mongoose';

const Schema = mongoose.Schema;
//Generate random numbers for order
const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();

const randomNumbers = Math.floor(1000 + Math.random() * 90000);

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,

    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },

    // id: false,
  }
);

//compile to form model
type Order = InferSchemaType<typeof OrderSchema>;
const Order = mongoose.model('Order', OrderSchema);

// validate shipping address

export default Order;

export interface OrderTypes {
  id: string;
  user: string;
  orderItems: Array<any>;
  shippingAddress: any;
  orderNumber: string;
  paymentStatus: string;
  paymentMethod: string;
  totalPrice: number;
  currency: string;
  status: string;
  deliveredAt: Date;
}
