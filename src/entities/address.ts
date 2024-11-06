import { ObjectId } from "mongoose";
import { User } from "./user";

export interface Address {
  _id?: ObjectId;
  cep: string;
  state: string;
  city: string;
  user: User;
}
