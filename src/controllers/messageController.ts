import { Response } from "express";
import MessageModel from "../models/message";
import { AuthenticatedRequest } from "../middlewares/token";
import UserModel from "../models/user";

export default class MessageController {
  static sendMessage = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { to, content } = req.body;
      const from = req.loggedUser;

      const newMessage = new MessageModel({
        to,
        from,
        content,
      });

      await newMessage.save();

      return res.status(201).json({
        success: true,
        message: "Mensagem enviada com sucesso!",
        data: newMessage,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Erro ao enviar a mensagem.",
        error: error.message,
      });
    }
  };

  static getMessages = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const from = req.loggedUser;

      const messages = await MessageModel.find({
        $or: [{ $and: [{ to: id }, { from }] }, { $and: [{ to: from }, { from: id }] }],
      }).populate("from");

      return res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar as mensagens.",
        error: error.message,
      });
    }
  };

  static getUserConversations = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const loggedUser = req.loggedUser;

      if (!loggedUser || !loggedUser._id) {
        return res.status(400).json({
          success: false,
          message: "Usuário não autenticado.",
        });
      }

      const userIds = await MessageModel.aggregate([
        { $match: { $or: [{ from: loggedUser._id }, { to: loggedUser._id }] } },
        {
          $group: { _id: { $cond: [{ $eq: ["$from", loggedUser._id] }, "$to", "$from"] } },
        },
        { $project: { _id: 1 } },
      ]);

      const ids = userIds.map((user) => user._id);

      const lastMessages = await MessageModel.aggregate([
        {
          $match: {
            $or: [
              { from: loggedUser._id, to: { $in: ids } },
              { to: loggedUser._id, from: { $in: ids } },
            ],
          },
        },
        { $sort: { _id: -1 } },
        {
          $group: {
            _id: { $cond: [{ $eq: ["$from", loggedUser._id] }, "$to", "$from"] },
            lastMessageId: { $first: "$_id" },
          },
        },
        { $sort: { lastMessageId: -1 } },
      ]);

      const sortedIds = lastMessages.map((msg) => msg._id.toString());

      const users = await UserModel.find({ _id: { $in: ids } });

      const usersWithMessages = sortedIds.map((id) =>
        users.find((user) => user._id.toString() === id)
      );

      return res.status(200).json({ success: true, data: usersWithMessages });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Erro ao listar usuários com mensagens.",
        error: error.message,
      });
    }
  };
}
