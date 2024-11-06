import { Response } from "express";
import MessageModel from "../models/message";
import { AuthenticatedRequest } from "../middlewares/token";
import UserModel from "../models/user";
import crypto from "crypto";

function encryptContent(content: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(process.env.SECRET_KEY!), iv);
  let encrypted = cipher.update(content, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

function decryptContent(encryptedContent: string): string {
  const [ivHex, encrypted] = encryptedContent.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(process.env.SECRET_KEY!), iv);
  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

export default class MessageController {
  static sendMessage = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { to, content } = req.body;
      const from = req.loggedUser;

      const encryptedContent = encryptContent(content);

      const newMessage = new MessageModel({
        to,
        from,
        content: encryptedContent,
      });

      await newMessage.save();

      return res.status(201).json({
        success: true,
        message: "Mensagem enviada com sucesso!",
        data: newMessage,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao enviar a mensagem.",
        error: (error as Error).message,
      });
    }
  };

  static getMessages = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const from = req.loggedUser;

      const messages = await MessageModel.find({
        $or: [{ $and: [{ to: id }, { from }] }, { $and: [{ to: from }, { from: id }] }],
      }).populate("from");

      const decryptedMessages = messages.map((message) => {
        if (message.to._id && from && from._id && message.from._id) {
          if (
            message.to._id.toString() === from._id.toString() ||
            message.from._id.toString() === from._id.toString()
          ) {
            return {
              ...message.toObject(),
              content: decryptContent(message.content),
            };
          } else {
            return res.status(403).json({
              success: false,
              message: "Você não possui permissão para listar as mensagens!",
            });
          }
        }
        return message;
      });
      return res.status(200).json({ success: true, data: decryptedMessages });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar as mensagens.",
        error: (error as Error).message,
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

  static hasUnreadMessages = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const loggedUser = req.loggedUser;

      if (!loggedUser || !loggedUser._id) {
        return res.status(400).json({ success: false, message: "Usuário não autenticado." });
      }

      const hasUnreadMessages = await MessageModel.exists({ to: loggedUser._id, seen: false });

      return res.status(200).json({ success: true, hasUnreadMessages: !!hasUnreadMessages });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Erro ao verificar mensagens não vistas.",
        error: error.message,
      });
    }
  };

  static markMessagesAsSeen = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const loggedUser = req.loggedUser;
      const { id } = req.params;

      if (!loggedUser || !loggedUser._id) {
        return res.status(400).json({ success: false, message: "Usuário não autenticado." });
      }

      const result = await MessageModel.updateMany(
        { to: loggedUser._id, from: id, seen: false },
        { $set: { seen: true } }
      );

      return res.status(200).json({
        success: true,
        message: `${result.modifiedCount} mensagens foram marcadas como visualizadas.`,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Erro ao marcar mensagens como visualizadas.",
        error: error.message,
      });
    }
  };
}
