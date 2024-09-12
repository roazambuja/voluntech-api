import { Response, Request } from "express";
import PixModel from "../models/pix";
import { AuthenticatedRequest } from "../middlewares/requireOrganization";

class PixController {
  static registerPix = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { type, key, name, bank } = req.body;
      const user = req.loggedUser;

      const alreadyExists = await PixModel.findOne({ user: user?._id });
      if (alreadyExists) {
        return res
          .status(400)
          .json({ success: false, message: "Você já cadastrou uma Chave PIX!" });
      }

      const pix = new PixModel({ type, key, name, bank, user: user?._id });
      const newPix = await pix.save();
      return res.status(201).json({
        success: false,
        message: "Chave PIX cadastrada com sucesso!",
        pix: newPix,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static getPixByUser = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const pix = await PixModel.findOne({ user: id });
      return res.status(200).json({ success: true, pix });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}

export default PixController;
