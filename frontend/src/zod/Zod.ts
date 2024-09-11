import { z } from "zod";

export const zodUser = z.object({
  username: z.string().email(),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters." })
    .max(15, { message: "Password must be maximum of 15 characters." }),
  fullname: z
    .string()
    .min(3, { message: "Full Name must be at least 3 characters." })
    .max(30, { message: "Full Name must be maximum of 15 characters." }),
});
export const zodLogin = z.object({
  username: z.string().email(),
  password: z.string().min(5).max(15),
});

export const zodUsername = z.string().email();

export const taskModel = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be minimum of 2 chars" })
    .max(50, { message: "Title must be lesser than 50 chars" }),
  description: z
    .string()
    .min(10, { message: "Description must be minimum of 10 chars" })
    .max(250, { message: "Description must be lesser than 250 chars" }),
  type: z.enum(["TODO", "IN_PROGRESS"], {
    message: "Invalid value for type of the task",
  }),
  dueDate: z.date({ message: "Invalid date format" }),
});

export const taskModelWithDateString = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be minimum of 2 chars" })
    .max(50, { message: "Title must be lesser than 50 chars" }),
  description: z
    .string()
    .min(10, { message: "Description must be minimum of 10 chars" })
    .max(250, { message: "Description must be lesser than 250 chars" }),
  type: z.enum(["TODO", "IN_PROGRESS", "DONE"], {
    message: "Invalid value for type of the task",
  }),
  dueDate: z.string({ message: "Due date is required" }),
});

export interface SimpleTaskModal {
  id: Number;
  title: string;
  description: string;
  type: string;
  dueDate: string;
  createdAt: string;
}
