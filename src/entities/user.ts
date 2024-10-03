import { ObjectId } from "mongoose";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  profilePicture?: {
    filePath: string;
    publicId: string;
  };
}

export interface Organization extends User {
  cause: string;
  description: string;
}
