import { Response } from "express";
import PostModel from "../models/post";
import { AuthenticatedRequest } from "../middlewares/token";
import { uploadToCloudinary } from "../services/cloudinary";
import ProjectModel from "../models/project";
import VolunteeringModel from "../models/volunteering";
import ParticipationModel from "../models/participation";

class PostController {
  static createPost = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { text, project } = req.body;
      const user = req.loggedUser;
      const files = req.files as Express.Multer.File[];

      if (!user) {
        return res.status(400).json({ success: false, message: "Usuário não encontrado." });
      }

      const projectExists = await ProjectModel.findOne({
        _id: project,
      }).populate("organization");

      if (!projectExists) {
        return res.status(400).json({
          success: false,
          message: "Projeto não encontrado.",
        });
      }

      if (projectExists.organization._id && user._id) {
        if (
          user.role === "Organização" &&
          projectExists.organization._id.toString() !== user._id.toString()
        ) {
          return res.status(403).json({
            success: false,
            message: "Você não tem permissão para fazer uma postagem nesse projeto.",
          });
        }
      }

      if (user.role === "Voluntário") {
        const volunteerings = await VolunteeringModel.find({ project: projectExists._id });

        if (!volunteerings.length) {
          return res.status(400).json({
            success: false,
            message: "Nenhum voluntariado encontrado para este projeto.",
          });
        }

        const participation = await ParticipationModel.findOne({
          volunteering: { $in: volunteerings.map((v) => v._id) },
          user: user._id,
          status: "confirmed",
        });

        if (!participation) {
          return res.status(403).json({
            success: false,
            message:
              "Você não tem permissão para postar nesse projeto, pois não está participando de nenhum voluntariado com status confirmado.",
          });
        }
      }

      let pictures: { filePath: string; publicId: string }[] = [];
      if (files && files.length > 0) {
        for (const file of files) {
          const data = await uploadToCloudinary(file.path, "post-pictures");
          if (data) {
            pictures.push({
              filePath: data.url,
              publicId: data.public_id,
            });
          }
        }
      }

      const newPost = new PostModel({
        text,
        project,
        user: user._id,
        pictures,
      });

      await newPost.save();

      return res.status(201).json({
        success: true,
        message: "Post criado com sucesso.",
        data: newPost,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
}

export default PostController;