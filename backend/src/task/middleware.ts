import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { failureMessage, isUserFound } from "../user/crud";
import { messages } from "../message";
import { PrismaClient } from "@prisma/client";
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("");
    }
    let authToken = req.headers["auth"] as string;
    if (authToken) {
      const prisma = new PrismaClient();
      const decode: any = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
      req.body.decode = decode;
      req.body.prisma = prisma;
      if (await isUserFound(decode.username, prisma)) {
        return res.status(411).json({
          message: "Unauthorized access!",
        });
      }
      next();
    } else {
      res.status(411).json({
        message: messages.unauth,
      });
    }
  } catch (e) {
    failureMessage(res, messages.failure);
  }
}
