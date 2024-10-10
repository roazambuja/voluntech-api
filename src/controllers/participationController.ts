import { Response } from "express";
import ParticipationModel from "../models/participation";
import VolunteeringModel from "../models/volunteering";
import { AuthenticatedRequest } from "../middlewares/token";

class ParticipationController {
  static createParticipation = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { volunteering: volunteeringId } = req.body;
      const user = req.loggedUser;

      if (!user) {
        return res.status(400).json({ success: false, message: "Usuário não encontrado." });
      }

      const volunteering = await VolunteeringModel.findById(volunteeringId);
      if (!volunteering) {
        return res.status(404).json({ success: false, message: "Voluntariado não encontrado." });
      }

      const participation = await ParticipationModel.findOne({ user, volunteering });
      if (participation) {
        return res
          .status(400)
          .json({ success: false, message: "Usuário já cadastrado no voluntariado." });
      }

      const newParticipation = new ParticipationModel({
        user: user._id,
        volunteering: volunteeringId,
        confirmed: false,
      });

      await newParticipation.save();

      return res.status(201).json({
        success: true,
        message: "Participação registrada com sucesso.",
        data: newParticipation,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  static alreadyParticipates = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { volunteering } = req.params;
      const user = req.loggedUser;

      if (!user) {
        return res.status(400).json({ success: false, message: "Usuário não encontrado." });
      }

      const alreadyParticipates = await ParticipationModel.findOne({ user, volunteering });

      return res.status(200).json({
        success: true,
        participates: alreadyParticipates ? true : false,
        confirmed: alreadyParticipates ? alreadyParticipates.confirmed : false,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}

export default ParticipationController;
