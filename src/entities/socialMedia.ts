import { ObjectId } from "mongoose";
import { User } from "./user";

export interface SocialMedia {
  _id?: ObjectId;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  user: User;
}
