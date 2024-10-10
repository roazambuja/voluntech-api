import mongoose, { Schema } from "mongoose";
import { Participation } from "../entities/participation";

const participationSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  volunteering: { type: Schema.Types.ObjectId, ref: "Volunteering", required: true },
  confirmed: { type: Boolean, default: false },
});

const ParticipationModel = mongoose.model<Participation>("Participation", participationSchema);

export default ParticipationModel;