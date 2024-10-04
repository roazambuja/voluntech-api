import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/token";
import FollowModel from "../models/follow";

class FollowController {
  static followOrganization = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { organization } = req.body;
      const user = req.loggedUser;

      if (!user) {
        return res.status(400).json({ success: false, message: "Usuário não encontrado." });
      }

      const alreadyFollows = await FollowModel.findOne({ user: user, organization: organization });
      if (alreadyFollows) {
        return res.status(400).json({ success: false, message: "O usuário já acompanha a ONG." });
      }

      const follow = new FollowModel({
        user,
        organization,
      });

      const newFollow = await follow.save();
      return res.status(200).json({
        success: true,
        data: newFollow,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}

export default FollowController;
