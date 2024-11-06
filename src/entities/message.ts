import { ObjectId } from "mongoose";
import { Organization, User } from "./user";

export interface Message {
  _id?: ObjectId;
  content: string;
  to: User | Organization;
  from: User | Organization;
  seen: boolean;
}
