//product schema
import mongoose, { InferSchemaType } from 'mongoose';
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      ref: 'Category',
      required: true,
    },
    sizes: {
      type: [String],
      enum: ['S', 'M', 'L', 'XL', 'XXL'],
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],

    price: {
      type: Number,
      required: true,
    },

    totalQty: {
      type: Number,
      required: true,
    },
    totalSold: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);
//Virtuals
//qty left
ProductSchema.virtual('totalReviews').get(function () {
  const product = this;
  return product?.reviews?.length;
});
// avg rating

// ProductSchema.virtual('averageRating').get(function () {
//   let totalRating = 0;
//   const product = this;
//   product?.reviews?.forEach((review: any) => {
//     totalRating += review.rating;
//   });
//   return totalRating / product?.reviews?.length;
// });
ProductSchema.virtual('averageRating').get(function () {
  const product = this;
  const totalRating = product?.reviews?.reduce((acc: any, review: any) => {
    return acc + review.rating;
  }, 0);
  return Number(totalRating / product?.reviews?.length).toFixed(1);
});
// total qty left
ProductSchema.virtual('qtyLeft').get(function () {
  const product = this;
  return product.totalQty - product.totalSold;
});

type Product = InferSchemaType<typeof ProductSchema>;
const Product = mongoose.model('Product', ProductSchema);

export default Product;
