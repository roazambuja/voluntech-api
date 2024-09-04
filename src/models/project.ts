import mongoose, { Schema } from "mongoose";
import { Project } from "../entities/project";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  headerPicture: {
    filePath: String,
    publicId: String,
  },
  organization: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const ProjectModel = mongoose.model<Project>("Project", projectSchema);

export default ProjectModel;
