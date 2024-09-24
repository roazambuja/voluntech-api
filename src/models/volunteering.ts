import mongoose, { Schema } from "mongoose";
import { Volunteering } from "../entities/volunteering";

const volunteeringSchema = new mongoose.Schema({
  category: { type: String, required: true },
  description: { type: String, required: true },
  whatsapp: { type: String, required: true },
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
});

const VolunteeringModel = mongoose.model<Volunteering>("Volunteering", volunteeringSchema);

export default VolunteeringModel;
