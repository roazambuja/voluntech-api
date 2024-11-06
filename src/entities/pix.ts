import { ObjectId } from "mongoose";
import { User } from "./user";

export enum PixType {
  Email = "email",
  Phone = "phone",
  CPF = "cpf",
  CNPJ = "cnpj",
  Random = "random",
}

export interface Pix {
  _id?: ObjectId;
  type: PixType;
  key: string;
  name: string;
  bank: string;
  user: User;
}
