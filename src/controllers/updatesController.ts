import { Response, Request } from "express";
import FollowModel from "../models/follow";
import ProjectModel from "../models/project";
import VolunteeringModel from "../models/volunteering";
import { AuthenticatedRequest } from "../middlewares/token";
import PostModel from "../models/post";
import OrganizationModel from "../models/organization";

class UpdatesController {
  static getFollowedUpdates = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { page = 1, limit = 30 } = req.query;
      const pageNumber = parseInt(page as string, 10) || 1;
      const pageLimit = parseInt(limit as string, 10) || 10;

      const user = req.loggedUser;
      if (!user) {
        return res.status(400).json({ success: false, message: "Usuário não encontrado." });
      }

      if (user.role === "Voluntário") {
        const followedOrganizations = await FollowModel.find({ user: user._id }).select(
          "organization"
        );
        const followedOrganizationIds = followedOrganizations.map((follow) => follow.organization);

        const projects = await ProjectModel.find({
          organization: { $in: followedOrganizationIds },
        })
          .populate("organization")
          .lean();

        const projectIds = projects.map((project) => project._id);

        const volunteerings = await VolunteeringModel.find({
          project: { $in: projectIds },
        })
          .populate({
            path: "project",
            populate: {
              path: "organization",
            },
          })
          .lean();

        const posts = await PostModel.find({
          project: { $in: projectIds },
        })
          .populate({
            path: "project",
          })
          .populate({ path: "user" })
          .lean();

        const labeledProjects = projects.map((project) => ({
          ...project,
          type: "project",
        }));

        const labeledVolunteerings = volunteerings.map((volunteering) => ({
          ...volunteering,
          type: "volunteering",
        }));

        const labeledPosts = posts.map((post) => ({
          ...post,
          type: "post",
        }));

        const combinedUpdates = [...labeledProjects, ...labeledVolunteerings, ...labeledPosts];
        combinedUpdates.sort((a, b) => (a._id < b._id ? 1 : -1));

        const totalItems = combinedUpdates.length;
        const paginatedUpdates = combinedUpdates.slice(
          (pageNumber - 1) * pageLimit,
          pageNumber * pageLimit
        );

        return res.status(200).json({
          success: true,
          data: paginatedUpdates,
          pagination: {
            totalItems,
            totalPages: Math.ceil(totalItems / pageLimit),
            currentPage: pageNumber,
            pageLimit,
          },
        });
      } else if (user.role === "Organização") {
        const userProjects = await ProjectModel.find({ organization: user._id }).select("_id");
        const projectIds = userProjects.map((project) => project._id);

        const postsByOthers = await PostModel.find({
          project: { $in: projectIds },
          user: { $ne: user._id },
        })
          .populate({
            path: "project",
            populate: {
              path: "organization",
            },
          })
          .populate({ path: "user" })
          .lean();

        const labeledPosts = postsByOthers.map((post) => ({
          ...post,
          type: "post",
        }));

        labeledPosts.sort((a, b) => (a._id < b._id ? 1 : -1));

        const totalItems = labeledPosts.length;
        const paginatedPosts = labeledPosts.slice(
          (pageNumber - 1) * pageLimit,
          pageNumber * pageLimit
        );

        return res.status(200).json({
          success: true,
          data: paginatedPosts,
          pagination: {
            totalItems,
            totalPages: Math.ceil(totalItems / pageLimit),
            currentPage: pageNumber,
            pageLimit,
          },
        });
      }

      return res.status(400).json({ success: false, message: "Tipo de usuário inválido." });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  static getProjectUpdates = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id: projectId } = req.params;
      const { page = 1, limit = 30 } = req.query;
      const pageNumber = parseInt(page as string, 10) || 1;
      const pageLimit = parseInt(limit as string, 10) || 10;

      const user = req.loggedUser;
      if (!user) {
        return res.status(400).json({ success: false, message: "Usuário não encontrado." });
      }

      const project = await ProjectModel.findById(projectId).lean();
      if (!project) {
        return res.status(400).json({ success: false, message: "Projeto não encontrado." });
      }

      const volunteerings = await VolunteeringModel.find({ project: projectId })
        .populate({
          path: "project",
          populate: {
            path: "organization",
          },
        })
        .lean();

      const posts = await PostModel.find({ project: projectId })
        .populate({
          path: "project",
        })
        .populate({ path: "user" })
        .lean();

      const labeledVolunteerings = volunteerings.map((volunteering) => ({
        ...volunteering,
        type: "volunteering",
      }));

      const labeledPosts = posts.map((post) => ({
        ...post,
        type: "post",
      }));

      const combinedUpdates = [...labeledVolunteerings, ...labeledPosts];
      combinedUpdates.sort((a, b) => (a._id < b._id ? 1 : -1));

      const totalItems = combinedUpdates.length;
      const paginatedUpdates = combinedUpdates.slice(
        (pageNumber - 1) * pageLimit,
        pageNumber * pageLimit
      );

      return res.status(200).json({
        success: true,
        data: paginatedUpdates,
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / pageLimit),
          currentPage: pageNumber,
          pageLimit,
        },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default UpdatesController;
