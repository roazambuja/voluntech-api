import mongoose from "mongoose";
import { User } from "../entities/user";

const userSchema = new mongoose.Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: {
      filePath: String,
      publicId: String,
    },
    role: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, discriminatorKey: "role" }
);

userSchema.index({ email: 1 }, { unique: true });

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
