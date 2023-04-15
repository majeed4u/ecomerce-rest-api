import mongoose, { InferSchemaType } from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Order',
      },
    ],
    whishLists: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'WhishList',
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    hasShippingAddress: {
      type: Boolean,
      default: false,
    },
    ShippingAddress: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      postalCode: {
        type: String,
      },
      province: {
        type: String,
      },
      country: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

type User = InferSchemaType<typeof UserSchema>;

type orders = InferSchemaType<typeof UserSchema>;

const User = mongoose.model('User', UserSchema);

export default User;
