import { InferSchemaType } from 'mongoose';
//category schema
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
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
    image: {
      type: String,
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

type Category = InferSchemaType<typeof CategorySchema>;

const Category = mongoose.model('Category', CategorySchema);

export default Category;
export interface CategoryTypes {
  name?: string;
  user?: string;
  image?: string;
  products?: string[];
}
