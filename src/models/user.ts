import mongoose from "mongoose";
import { User } from "../entities/user";
import validator from "validator";

const userSchema = new mongoose.Schema<User>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "O email digitado não é um email válido!",
      },
    },
    password: { type: String, required: true },
    profilePicture: {
      filePath: String,
      publicId: String,
    },
    role: { type: String, enum: ["Organização", "Voluntário"], required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, discriminatorKey: "role" }
);

const UserModel = mongoose.model<User>("User", userSchema);
export default UserModel;
