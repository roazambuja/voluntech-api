import { Request, Response } from "express";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email: email });
      if (!user) {
        return res.status(401).json({ success: false, message: "E-mail ou senha inválidos." });
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return res.status(401).json({ success: false, message: "E-mail ou senha inválidos." });
      }

      try {
        const secret = process.env.SECRET;

        const payload = {
          user: user.id,
        };

        if (secret) {
          const token = jwt.sign(payload, secret);
          return res.status(200).json({
            message: "Login realizado com sucesso!",
            token,
          });
        }
      } catch (error: any) {
        return res.status(500).json({
          success: false,
          message: error.message,
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

export default AuthController;
