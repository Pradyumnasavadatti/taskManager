import express from "express";
import { createUser, getUser } from "./crud";

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "User Route",
  });
});

router.post("/getUser", getUser);
router.post("/createUser", createUser);

export default router;
