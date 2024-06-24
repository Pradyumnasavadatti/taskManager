import express from "express";
import router from "./user/route";
import { PrismaClient } from "@prisma/client";
const app = express();
app.use(express.json());
app.use("/user", router);

app.listen(3001, async () => {
  console.log("Server started at 3000");
});
