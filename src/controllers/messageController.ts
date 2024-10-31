import { Response } from "express";
import MessageModel from "../models/message";
import { AuthenticatedRequest } from "../middlewares/token";

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
}
