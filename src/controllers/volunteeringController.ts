import { Response } from "express";
import VolunteeringModel from "../models/volunteering";
import { AuthenticatedRequest } from "../middlewares/token";
import ProjectModel from "../models/project";

class VolunteeringController {
  static createVolunteering = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { category, description, whatsapp, project } = req.body;
      const loggedUser = req.loggedUser;

      const projectData = await ProjectModel.findOne({
        _id: project,
        organization: loggedUser?._id,
      });
      if (!projectData) {
        return res.status(404).json({
          success: false,
          message: "Projeto não encontrado ou você não tem permissão para editá-lo.",
        });
      }

      const volunteering = await new VolunteeringModel({
        category,
        description,
        whatsapp,
        project,
      });

      const newVolunteering = await volunteering.save();

      return res
        .status(200)
        .json({ success: true, message: "Voluntariado cadastrado com sucesso!", newVolunteering });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}

export default VolunteeringController;
