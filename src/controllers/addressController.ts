import { Request, Response } from "express";
import AddressModel from "../models/address";

class AddressController {
  static getUserAdress = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const address = await AddressModel.findOne({ user: id });
      return res.status(200).json({ success: true, address });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}

export default AddressController;
