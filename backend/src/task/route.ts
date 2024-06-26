import express from "express";
import { authMiddleware } from "./middleware";
import {
  addTask,
  deleteAccount,
  deleteTodo,
  getTasks,
  updateTodo,
} from "./crud";

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  res.json({
    message: req.body.decode.username,
  });
});
router.get("/getTasks", authMiddleware, getTasks);
router.post("/addTask", authMiddleware, addTask);
router.post("/deleteTask", authMiddleware, deleteTodo);
router.post("/deleteAccount", authMiddleware, deleteAccount);
router.post("/updateTask", authMiddleware, updateTodo);

export default router;
