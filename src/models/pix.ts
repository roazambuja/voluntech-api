import mongoose, { Schema } from "mongoose";
import { Pix, PixType } from "../entities/pix";

const pixSchema = new mongoose.Schema({
  type: { type: String, enum: Object.values(PixType), required: true },
  key: { type: String, required: true },
  name: { type: String, required: true },
  bank: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const PixModel = mongoose.model<Pix>("Pix", pixSchema);

export default PixModel;
