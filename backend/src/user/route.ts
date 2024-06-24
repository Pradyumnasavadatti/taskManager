import express from "express";
import { getUser, loginHandler, signupHandler } from "./crud";

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "User Route",
  });
});

router.post("/getUser", getUser);
router.post("/signupUser", signupHandler);
router.post("/loginUser", loginHandler);

export default router;
