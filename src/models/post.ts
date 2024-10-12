import mongoose, { Schema } from "mongoose";
import { Post } from "../entities/post";

const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  pictures: [
    {
      filePath: String,
      publicId: String,
    },
  ],
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const PostModel = mongoose.model<Post>("Post", postSchema);

export default PostModel;
