import { ObjectId } from "mongoose";
import { User } from "./user";

export interface Project {
  _id?: ObjectId;
  organization: User;
  title: string;
  description: string;
  headerPicture?: {
    filePath: string;
    publicId: string;
  };
}
