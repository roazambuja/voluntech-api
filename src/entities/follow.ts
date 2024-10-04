import { ObjectId } from "mongoose";
import { Organization, User } from "./user";

export interface Follow {
  _id?: ObjectId;
  user: User;
  organization: Organization;
}
