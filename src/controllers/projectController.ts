import { Response, Request } from "express";
import { uploadToCloudinary } from "../services/cloudinary";
import ProjectModel from "../models/project";
import { AuthenticatedRequest } from "../middlewares/requireOrganization";

class ProjectController {
  static registerProject = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title, description } = req.body;
      const user = req.loggedUser;

      if (!user) {
        return res.status(400).json({ success: false, message: "Usuário não encontrado." });
      }

      let data;
      if (req.file) {
        data = await uploadToCloudinary(req.file.path, "header-pictures");
      }

      const project = new ProjectModel({
        title,
        description,
        organization: user._id,
        headerPicture: {
          filePath: data?.url,
          publicId: data?.public_id,
        },
      });

      const newProject = await project.save();
      return res.status(200).json({
        success: true,
        message: "Seu projeto foi cadastrado com sucesso!",
        data: newProject,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static getUserProjects = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const projects = await ProjectModel.find({ organization: id });
      return res.status(200).json({ success: true, projects });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static getProject = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const project = await ProjectModel.findOne({ _id: id }).populate("organization", "name");
      if (project) {
        return res.status(200).json({ success: true, project });
      } else {
        return res.status(400).json({ success: false, message: "O projeto não foi encontrado." });
      }
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}

export default ProjectController;
