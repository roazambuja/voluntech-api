import mongoose, { Schema } from "mongoose";
import { Address } from "../entities/address";

const addressSchema = new mongoose.Schema({
  cep: {
    type: String,
    required: true,
    match: [/^\d{8}$/, "CEP inválido! Deve conter exatamente 8 caracteres numéricos."],
  },
  city: { type: String, required: true },
  state: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const AddressModel = mongoose.model<Address>("Address", addressSchema);

export default AddressModel;
