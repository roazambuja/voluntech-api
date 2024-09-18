import { Response, Request } from "express";
import SocialMediaModel from "../models/socialMedia";
import { AuthenticatedRequest } from "../middlewares/token";

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

  static updateSocialMedia = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const updateData: any = {};
      const unsetData: any = {};
      const id = req.params.id;
      const { whatsapp, instagram, facebook, tiktok } = req.body;
      const user = req.loggedUser;

      whatsapp === "" || !whatsapp ? (unsetData.whatsapp = "") : (updateData.whatsapp = whatsapp);
      instagram === "" || !instagram
        ? (unsetData.instagram = "")
        : (updateData.instagram = instagram);
      facebook === "" || !facebook ? (unsetData.facebook = "") : (updateData.facebook = facebook);
      tiktok === "" || !tiktok ? (unsetData.tiktok = "") : (updateData.tiktok = tiktok);

      const socialMedia = await SocialMediaModel.findOneAndUpdate(
        { _id: id, user: user?._id },
        {
          $set: updateData,
          $unset: unsetData,
        },
        {
          new: true,
        }
      );

      if (!socialMedia) {
        return res.status(404).json({
          success: false,
          message: "Redes sociais não encontradas ou você não tem permissão para editá-las.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Redes sociais atualizadas com sucesso!",
        socialMedia: socialMedia,
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
