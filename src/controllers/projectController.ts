import { Response } from "express";
import { uploadToCloudinary } from "../services/cloudinary";
import ProjectModel from "../models/project";
import { AuthenticatedRequest } from "../middlewares/token";

class ProjectController {
  static registerProject = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title, description } = req.body;
      const user = req.loggedUser;

      if (user?.role === "Organização") {
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
      } else {
        return res.status(400).json({
          success: false,
          message: "Você não possui permissão para realizar essa ação!",
        });
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
