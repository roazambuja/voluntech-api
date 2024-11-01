import mongoose, { Schema } from "mongoose";
import { Message } from "../entities/message";

const messageSchema = new mongoose.Schema({
  to: { type: Schema.Types.ObjectId, ref: "User", required: true },
  from: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  seen: { type: Boolean, default: false },
});

const MessageModel = mongoose.model<Message>("Message", messageSchema);

export default MessageModel;
