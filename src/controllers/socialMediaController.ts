import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireOrganization";
import SocialMediaModel from "../models/socialMedia";

class SocialMediaController {
  static registerSocialMedia = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { whatsapp, instagram, facebook, tiktok } = req.body;
      const user = req.loggedUser;

      const alreadyExists = await SocialMediaModel.findOne({ user: user?._id });
      if (alreadyExists) {
        return res
          .status(400)
          .json({ success: false, message: "Você já cadastrou suas redes sociais!" });
      }

      const socialMedia = new SocialMediaModel({
        whatsapp,
        instagram,
        facebook,
        tiktok,
        user: user?._id,
      });
      const newSocialMedia = await socialMedia.save();
      return res.status(201).json({
        success: false,
        message: "Redes sociais cadastradas com sucesso!",
        socialMedia: newSocialMedia,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}

export default SocialMediaController;
