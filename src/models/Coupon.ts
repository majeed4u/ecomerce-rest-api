//coupon model
import mongoose, { InferSchemaType } from 'mongoose';
const Schema = mongoose.Schema;

const CouponSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

//coupon is expired
CouponSchema.virtual('isExpired').get(function (this: any) {
  return Date.now() > this.endDate;
});

// days left
CouponSchema.virtual('daysLeft').get(function (this: any) {
  const DaysLef = Math.floor(
    (this.endDate - Date.now()) / (1000 * 60 * 60 * 24)
  );

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
  const discount = this.discount as number;
  if (discount <= 0 || discount > 100) {
    next(new Error('Discount must be between 1 and 100'));
  }

  next();
});

CouponSchema.pre('validate', function (this: any, next) {
  if (this.startDate < Date.now()) {
    next(new Error('Start date must be greater than current date'));
  }
  next();
});

CouponSchema.pre('validate', function (this: any, next) {
  if (this.endDate < Date.now()) {
    next(new Error('End date must be greater than current date'));
  }
  next();
});

export type Coupon = InferSchemaType<typeof CouponSchema>;

const Coupon = mongoose.model('Coupon', CouponSchema);

export default Coupon;

export interface CouponInput extends Document {
  id: string;
  code: string;
  startDate: Date;
  endDate: Date;
  discount: number;
  user: string;
  isExpired: boolean;
}
