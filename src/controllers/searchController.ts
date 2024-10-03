import { Request, Response } from "express";
import VolunteeringModel from "../models/volunteering";
import ProjectModel from "../models/project";
import UserModel from "../models/user";
import AddressModel from "../models/address";

class SearchController {
  static searchAll = async (req: Request, res: Response) => {
    try {
      const { query, page = 1, limit = 10 } = req.query;

      if (!query || typeof query !== "string") {
        return res.status(400).json({ success: false, message: "Consulta de busca inválida" });
      }

      const searchQuery = query.trim();
      const pageNumber = parseInt(page as string) || 1;
      const pageLimit = parseInt(limit as string) || 10;

      const addresses = await AddressModel.find({
        city: { $regex: searchQuery, $options: "i" },
      })
        .populate("user")
        .lean();

      const usersFromCity = addresses
        .map((address) => {
          if (address.user && address.user._id) {
            return {
              ...address.user,
              address: {
                city: address.city,
                state: address.state,
              },
            };
          }
          return null;
        })
        .filter((user) => user !== null);

      const usersFromName = await UserModel.find({
        name: { $regex: searchQuery, $options: "i" },
      })
        .sort({ created_at: -1 })
        .lean();

      const usersFromCause = await UserModel.find({
        cause: { $regex: searchQuery, $options: "i" },
      })
        .sort({ created_at: -1 })
        .lean();

      const usersWithAddress = await Promise.all(
        [...usersFromName, ...usersFromCause].map(async (user) => {
          const address = await AddressModel.findOne({ user: user._id }).lean();
          return {
            ...user,
            address: address ? { city: address.city, state: address.state } : null,
          };
        })
      );

      const combinedUsers = [...usersFromCity, ...usersWithAddress].reduce((acc, user) => {
        if (user && user._id) {
          acc[user._id.toString()] = user;
        }
        return acc;
      }, {} as Record<string, any>);

      const uniqueUsers = Object.values(combinedUsers);

      const totalUsers = uniqueUsers.length;
      const paginatedUsers = uniqueUsers.slice(
        (pageNumber - 1) * pageLimit,
        pageNumber * pageLimit
      );

      const [volunteerings, totalVolunteerings] = await Promise.all([
        VolunteeringModel.find({
          category: { $regex: searchQuery, $options: "i" },
        })
          .populate("project")
          .sort({ _id: -1 })
          .skip((pageNumber - 1) * pageLimit)
          .limit(pageLimit),
        VolunteeringModel.countDocuments({
          category: { $regex: searchQuery, $options: "i" },
        }),
      ]);

      const [projects, totalProjects] = await Promise.all([
        ProjectModel.find({
          title: { $regex: searchQuery, $options: "i" },
        })
          .populate("organization")
          .sort({ _id: -1 })
          .skip((pageNumber - 1) * pageLimit)
          .limit(pageLimit),
        ProjectModel.countDocuments({
          title: { $regex: searchQuery, $options: "i" },
        }),
      ]);

      const totalItems = Math.max(totalUsers, totalVolunteerings, totalProjects);
      const totalPages = Math.ceil(totalItems / pageLimit);

      return res.status(200).json({
        success: true,
        data: {
          volunteerings,
          projects,
          users: paginatedUsers,
        },
        pagination: {
          totalItems,
          totalPages,
          currentPage: pageNumber,
          pageLimit,
        },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default SearchController;
