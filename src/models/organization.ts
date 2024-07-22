import mongoose from "mongoose";
import UserModel from "./user";

const OrganizationSchema = new mongoose.Schema({
  description: { type: String },
  cause: { type: String, required: true },
});

const OrganizationModel = UserModel.discriminator("Organização", OrganizationSchema);
export default OrganizationModel;
