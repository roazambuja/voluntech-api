import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user";
import { User } from "../entities/user";

export interface AuthenticatedRequest extends Request {
  loggedUser?: User;
}

async function checkToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  try {
    const secret = process.env.SECRET;
    const decoded: any = secret && jwt.verify(token, secret);

    if (decoded) {
      const user = await UserModel.findOne({ _id: decoded.user });
      if (user) {
        req.loggedUser = user;
      }
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Acesso negado!" });
  }
}

export default checkToken;
