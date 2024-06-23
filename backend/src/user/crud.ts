import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import { messages } from "../message";

const prisma = new PrismaClient();
export async function getUser(req: Request, res: Response) {
  try {
    const user = req.body;
    const result = await isUserFound(user.username);
    if (result) {
      res.status(200).json({
        //Sending false because user with requested emailId is not found
        message: false,
      });
    } else {
      res.status(200).json({
        message: messages.userFound,
      });
    }
  } catch (e) {
    failureMessage(res, messages.failure);
  }
}

export async function createUser(req: Request, res: Response) {
  if (await isUserFound(req.body.username)) {
    const user = req.body;
    if (user.username == "" || user.password == "" || user.fullname == "") {
      res.status(200).json({
        message: messages.fillDetails,
      });
    } else {
      try {
        const result = await prisma.user.create({
          data: user,
        });
        res.status(200).json({
          message: messages.userCreated,
        });
      } catch (e) {
        failureMessage(res, messages.failure);
      }
    }
  } else {
    failureMessage(res, messages.userFound);
  }
}

async function isUserFound(username: string) {
  const result = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  return result === null;
}

function failureMessage(res: Response, msg: string) {
  res.status(500).json({
    message: msg,
  });
}
