import { InferSchemaType } from 'mongoose';
//Color schema
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ColorSchema = new Schema(
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
  },
  { timestamps: true }
);
type Color = InferSchemaType<typeof ColorSchema>;
const Color = mongoose.model('Color', ColorSchema);

export default Color;
export interface ColorType {
  name: string;
  user: string;
}
