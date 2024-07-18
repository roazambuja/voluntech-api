import mongoose from "mongoose";
import { Users } from "../entities/user";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, discriminatorKey: "role" }
);

UserSchema.index({ email: 1 }, { unique: true });

const UserModel = mongoose.model<Users>("User", UserSchema);

export default UserModel;
