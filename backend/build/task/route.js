"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("./middleware");
const crud_1 = require("./crud");
const router = express_1.default.Router();
router.get("/", middleware_1.authMiddleware, (req, res) => {
    res.json({
        message: req.body.decode.username,
    });
});
router.get("/getTasks", middleware_1.authMiddleware, crud_1.getTasks);
router.post("/addTask", middleware_1.authMiddleware, crud_1.addTask);
router.post("/deleteTask", middleware_1.authMiddleware, crud_1.deleteTodo);
router.post("/deleteAccount", middleware_1.authMiddleware, crud_1.deleteAccount);
router.post("/updateTask", middleware_1.authMiddleware, crud_1.updateTodo);
exports.default = router;
