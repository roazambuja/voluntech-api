import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user";
import { User } from "../entities/user";

export interface AuthenticatedRequest extends Request {
  loggedUser?: User;
}

export function requireOrganization(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const secret = process.env.SECRET;

    token &&
      secret &&
      jwt.verify(token, secret, async (err: any, decoded: any) => {
        if (err) {
          return res.status(403).json({ message: "Token inválido!" });
        }

        const user = await UserModel.findOne({ _id: decoded.user });

        if (!user) {
          return res.status(404).json({ message: "Usuário não encontradoooooo." });
        }

        req.loggedUser = user;

        if (user.role !== "Organização") {
          return res
            .status(403)
            .json({ message: "Acesso negado! Apenas organizações podem realizar essa ação." });
        }

        next();
      });
  } catch (error) {
    return res.status(500).json({ message: "Erro no servidor." });
  }
}
