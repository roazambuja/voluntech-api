import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

function checkToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  try {
    const secret = process.env.SECRET;
    secret && jwt.verify(token, secret);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Acesso negado!" });
  }
}

export default checkToken;
