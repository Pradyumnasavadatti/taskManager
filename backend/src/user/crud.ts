import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import { messages } from "../message";
import { zodLogin, zodUser, zodUsername } from "./zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let saltRounds = 7;

export async function getUser(req: Request, res: Response) {
  try {
    const user = req.body;
    const { success } = zodUsername.safeParse(user.username);
    if (success) {
      const prisma = new PrismaClient();
      const result = await isUserFound(user.username, prisma);
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
    } else {
      failureMessage(res, messages.invalidInput);
    }
  } catch (e) {
    failureMessage(res, messages.failure);
  }
}

export async function signupHandler(req: Request, res: Response) {
  const user = req.body;
  const { success } = zodUser.safeParse(user);
  if (!success) {
    res.status(200).json({
      message: messages.invalidInput,
    });
    return;
  }
  try {
    const prisma = new PrismaClient();
    if (await isUserFound(req.body.username, prisma)) {
      let promise = new Promise((res) => {
        bcrypt.hash(user.password, saltRounds, (err, response) => {
          if (err) throw new Error();
          user.password = response;
          res("");
        });
      });
      await promise;
      const result = await prisma.user.create({
        data: user,
      });
      res.status(200).json({
        message: messages.userCreated,
      });
    } else {
      failureMessage(res, messages.userFound);
    }
  } catch (e) {
    failureMessage(res, messages.failure);
  }
}

export async function loginHandler(req: Request, res: Response) {
  const body = req.body;
  const { success } = zodLogin.safeParse(body);
  let key = process.env.JWT_SECRET_KEY || null;
  if (!success) {
    failureMessage(res, messages.invalidInput);
    return;
  }

  try {
    const prisma = new PrismaClient();
    let isCorrect;
    const user = await prisma.user.findUnique({
      where: {
        username: body.username,
      },
      select: {
        username: true,
        password: true,
      },
    });
    if (user != null) {
      isCorrect = await bcrypt.compare(body.password, user.password);
      if (isCorrect && process.env.JWT_SECRET_KEY) {
        let token = jwt.sign(
          { username: user.username },
          process.env.JWT_SECRET_KEY
        );
        res.status(200).json({
          message: token,
        });
      } else {
        res.status(200).json({
          message: false,
        });
      }
    } else {
      throw new Error("");
    }
  } catch (e) {
    failureMessage(res, messages.failure);
  }
}

async function isUserFound(username: string, prisma: PrismaClient) {
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
