import { z } from "zod";

export const zodUser = z.object({
  username: z.string().email(),
  password: z.string().min(5).max(15),
  fullname: z.string().min(3).max(30),
});

export const zodUsername = z.string().email();

export const zodLogin = z.object({
  username: z.string().email(),
  password: z.string().min(5).max(15),
});
