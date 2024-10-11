import { Response } from "express";
import ParticipationModel from "../models/participation";
import VolunteeringModel from "../models/volunteering";
import { AuthenticatedRequest } from "../middlewares/token";
import ProjectModel from "../models/project";

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
        status: "pending",
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
        status: alreadyParticipates?.status,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static answerParticipationRequest = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const user = req.loggedUser;

      if (!user) {
        return res.status(400).json({ success: false, message: "Usuário não encontrado." });
      }

      const participation = await ParticipationModel.findOneAndUpdate(
        { _id: id },
        { status },
        { new: true }
      );

      if (!participation) {
        return res.status(400).json({ success: false, message: "Voluntariado não encontrado." });
      }

      return res.status(200).json({
        success: true,
        participation,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static getPendingRequests = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.loggedUser;

      if (!user) {
        return res.status(400).json({ success: false, message: "Usuário não encontrado." });
      }

      const projects = await ProjectModel.find({ organization: user._id }).select("_id");
      const projectIds = projects.map((project) => project._id);

      const volunteerings = await VolunteeringModel.find({ project: { $in: projectIds } }).select(
        "_id"
      );
      const volunteeringIds = volunteerings.map((volunteering) => volunteering._id);

      const participations = await ParticipationModel.find({
        volunteering: { $in: volunteeringIds },
        status: "pending",
      })
        .populate("user", "name _id profilePicture")
        .populate({
          path: "volunteering",
          populate: {
            path: "project",
          },
        })
        .sort({ _id: -1 });

      return res.status(200).json({
        success: true,
        participations,
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
