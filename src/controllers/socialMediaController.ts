import { Response, Request } from "express";
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

  static getSocialMediaByUser = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const socialMedia = await SocialMediaModel.findOne({ user: id });
      return res.status(200).json({ success: true, socialMedia });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static getSocialMediaById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const socialMedia = await SocialMediaModel.findOne({ _id: id });
      return res.status(200).json({ success: true, socialMedia });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}

export default SocialMediaController;
