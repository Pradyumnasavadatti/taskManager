import express from "express";
import router from "./user/route";
const app = express();
app.use(express.json());
app.use("/user", router);

app.listen(3001, () => {
  console.log("Server started at 3000");
});
