import mongoose, { Schema } from "mongoose";
import { Follow } from "../entities/follow";

const followSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
});

const FollowModel = mongoose.model<Follow>("Follow", followSchema);

export default FollowModel;
