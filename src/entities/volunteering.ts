import { ObjectId } from "mongoose";
import { Project } from "./project";

export interface Volunteering {
  _id?: ObjectId;
  category: string;
  description: string;
  whatsapp: string;
  project: Project;
}
