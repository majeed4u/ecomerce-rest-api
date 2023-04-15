import { InferSchemaType } from 'mongoose';
//Review Schema
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);
type Review = InferSchemaType<typeof ReviewSchema>;

const Review = mongoose.model('Review', ReviewSchema);

export default Review;

export interface ReviewType {
  user: string;
  product: string;
  message: string;
  rating: number;
}

export interface ReviewProductId {
  productId: mongoose.Types.ObjectId;
}
