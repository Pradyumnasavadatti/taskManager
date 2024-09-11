import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import { messages } from "../message";
import { zodLogin, zodUser, zodUsername } from "./zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let saltRounds = 7;
const prisma = new PrismaClient();
export async function getUser(req: Request, res: Response) {
  try {
    const user = req.body;
    const { success } = zodUsername.safeParse(user.username);
    if (success) {
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
    res.status(411).json({
      message: messages.invalidInput,
    });
    return;
  }
  try {
    if (await isUserFound(req.body.username)) {
      let promise = new Promise((res) => {
        bcrypt.hash(user.password, saltRounds, (err, response) => {
          if (err) throw new Error();
          user.password = response;
          res("");
        });
      });
      await promise;
      await prisma.user.create({
        data: user,
      });
      if (process.env.JWT_SECRET_KEY) {
        let token = jwt.sign(
          {
            username: user.username,
          },
          process.env.JWT_SECRET_KEY
        );
        res.status(200).json({
          message: token,
        });
      }
    } else {
      res.status(411).json({
        message: messages.userFound,
      });
    }
  } catch (e) {
    failureMessage(res, messages.failure);
  }
}

export async function loginHandler(req: Request, res: Response) {
  const body = req.body;
  const { success, error } = zodLogin.safeParse(body);
  if (!success) {
    res.status(411).json({
      message: messages.invalidInput,
    });
    return;
  }

  try {
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
          {
            username: user.username,
          },
          process.env.JWT_SECRET_KEY
        );
        res.status(200).json({
          message: token,
        });
      } else {
        res.status(411).json({
          message: messages.invalidInput,
        });
      }
    } else {
      res.status(411).json({
        message: messages.invalidInput,
      });
    }
  } catch (e) {
    failureMessage(res, messages.failure);
  }
}

export async function isUserFound(username: string) {
  const result = await prisma.user.findUnique({
    where: {
      username: username,
    },
    select: {
      username: true,
    },
  });
  return result === null;
}

export function failureMessage(res: Response, msg: string) {
  res.status(500).json({
    message: msg,
  });
}
