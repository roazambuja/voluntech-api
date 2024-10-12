import { ObjectId } from "mongoose";
import { Organization, User } from "./user";
import { Project } from "./project";

export interface Post {
  _id?: ObjectId;
  project: Project;
  user: User | Organization;
  text: string;
  pictures?: {
    filePath: string;
    publicId: string;
  }[];
}
