import mongoose from "mongoose";
import UserModel from "./user";
import { UNDevelopmentGoals } from "../entities/user";

const OrganizationSchema = new mongoose.Schema({
  description: { type: String },
  cause: { type: String, required: true },
  developmentGoals: { type: [String], enum: UNDevelopmentGoals },
});

const OrganizationModel = UserModel.discriminator("Organização", OrganizationSchema);
export default OrganizationModel;
