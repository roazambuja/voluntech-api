import mongoose, { Schema } from "mongoose";
import { SocialMedia } from "../entities/socialMedia";

const socialMediaSchema = new mongoose.Schema({
  whatsapp: { type: String },
  facebook: { type: String },
  instagram: { type: String },
  tiktok: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const SocialMediaModel = mongoose.model<SocialMedia>("SocialMedia", socialMediaSchema);

export default SocialMediaModel;
