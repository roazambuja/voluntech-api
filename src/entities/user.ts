import { ObjectId } from "mongoose";

export interface Users {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
}
