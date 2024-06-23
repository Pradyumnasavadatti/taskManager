import express from "express";
import router from "./user/route";
const app = express();

app.use("/user", router);

app.listen(3000, () => {
  console.log("Server started at 3000");
});
