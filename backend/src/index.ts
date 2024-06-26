import express from "express";
import router from "./user/route";
import taskRouter from "./task/route";
import { PrismaClient } from "@prisma/client";
const app = express();
app.use(express.json());
app.use("/user", router);
app.use("/task", taskRouter);

app.listen(3001, async () => {
  console.log("Server started at 3000");
});
