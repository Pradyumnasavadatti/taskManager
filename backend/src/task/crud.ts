import { Request, Response } from "express";
import { failureMessage } from "../user/crud";
import { messages } from "../message";
import { PrismaClient, Task } from "@prisma/client";
const prisma = new PrismaClient();
export async function getTasks(req: Request, res: Response) {
  try {
    const username = getUsername(req);
    const tasks = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        tasks: true,
      },
    });
    res.status(200).json({
      message: tasks,
    });
  } catch (e) {
    failureMessage(res, messages.failure);
  }
}

export async function addTask(req: Request, res: Response) {
  try {
    const username = getUsername(req);
    const task = req.body.task;
    const response = await prisma.task.create({
      data: {
        title: task.title,
        description: task.description,
        type: task.type,
        dueDate: new Date(task.dueDate),
        username: username,
      },
    });
    res.status(200).json({
      message: {
        id: response.id,
      },
    });
  } catch (e) {
    failureMessage(res, messages.failure);
  }
}

export async function updateTodo(req: Request, res: Response) {
  try {
    const username = getUsername(req);
    const task = req.body.task;
    const response = await prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        title: task.title,
        description: task.description,
        type: task.type,
        dueDate: new Date(task.dueDate),
        username: username,
      },
    });
    res.status(200).json({
      message: true,
    });
  } catch (e) {
    failureMessage(res, messages.failure);
  }
}

export async function deleteTodo(req: Request, res: Response) {
  try {
    const task: Task = req.body.task;
    const response = await prisma.task.delete({
      where: {
        id: task.id,
      },
    });
    res.status(200).json({
      message: true,
    });
  } catch (e) {
    failureMessage(res, messages.failure);
  }
}

export async function deleteAccount(req: Request, res: Response) {
  try {
    const username = getUsername(req);
    const response1 = await prisma.task.deleteMany({
      where: {
        username,
      },
    });

    const response2 = await prisma.user.deleteMany({
      where: {
        username,
      },
    });
    res.status(200).json({
      message: true,
    });
  } catch (e) {
    failureMessage(res, messages.failure);
  }
}

function getUsername(req: Request) {
  return req.body.decode.username;
}
