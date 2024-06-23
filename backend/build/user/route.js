"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crud_1 = require("./crud");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    return res.status(200).json({
        message: "User Route",
    });
});
router.post("/getUser", crud_1.getUser);
router.post("/createUser", crud_1.createUser);
exports.default = router;
