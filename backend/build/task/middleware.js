"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crud_1 = require("../user/crud");
const message_1 = require("../message");
const client_1 = require("@prisma/client");
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!process.env.JWT_SECRET_KEY) {
                throw new Error("");
            }
            let authToken = req.headers["auth"];
            if (authToken) {
                const prisma = new client_1.PrismaClient();
                const decode = jsonwebtoken_1.default.verify(authToken, process.env.JWT_SECRET_KEY);
                req.body.decode = decode;
                req.body.prisma = prisma;
                if (yield (0, crud_1.isUserFound)(decode.username, prisma)) {
                    return res.status(411).json({
                        message: "Unauthorized access!",
                    });
                }
                next();
            }
            else {
                res.status(411).json({
                    message: message_1.messages.unauth,
                });
            }
        }
        catch (e) {
            (0, crud_1.failureMessage)(res, message_1.messages.failure);
        }
    });
}
exports.authMiddleware = authMiddleware;
