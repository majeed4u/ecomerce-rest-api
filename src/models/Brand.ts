import { InferSchemaType } from 'mongoose';
//Brand schema
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const BrandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

type Brand = InferSchemaType<typeof BrandSchema>;

const Brand = mongoose.model('Brand', BrandSchema);

export default Brand;

export interface BrandType {
  name: string;
  user: string;
  products: string[];
}
