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
exports.failureMessage = exports.isUserFound = exports.loginHandler = exports.signupHandler = exports.getUser = void 0;
const client_1 = require("@prisma/client");
const message_1 = require("../message");
const zod_1 = require("./zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let saltRounds = 7;
const prisma = new client_1.PrismaClient();
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.body;
            const { success } = zod_1.zodUsername.safeParse(user.username);
            if (success) {
                const result = yield isUserFound(user.username);
                if (result) {
                    res.status(200).json({
                        //Sending false because user with requested emailId is not found
                        message: false,
                    });
                }
                else {
                    res.status(200).json({
                        message: message_1.messages.userFound,
                    });
                }
            }
            else {
                failureMessage(res, message_1.messages.invalidInput);
            }
        }
        catch (e) {
            failureMessage(res, message_1.messages.failure);
        }
    });
}
exports.getUser = getUser;
function signupHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.body;
        const { success } = zod_1.zodUser.safeParse(user);
        if (!success) {
            res.status(411).json({
                message: message_1.messages.invalidInput,
            });
            return;
        }
        try {
            if (yield isUserFound(req.body.username)) {
                let promise = new Promise((res) => {
                    bcrypt_1.default.hash(user.password, saltRounds, (err, response) => {
                        if (err)
                            throw new Error();
                        user.password = response;
                        res("");
                    });
                });
                yield promise;
                yield prisma.user.create({
                    data: user,
                });
                if (process.env.JWT_SECRET_KEY) {
                    let token = jsonwebtoken_1.default.sign({
                        username: user.username,
                    }, process.env.JWT_SECRET_KEY);
                    res.status(200).json({
                        message: token,
                    });
                }
            }
            else {
                res.status(411).json({
                    message: message_1.messages.userFound,
                });
            }
        }
        catch (e) {
            failureMessage(res, message_1.messages.failure);
        }
    });
}
exports.signupHandler = signupHandler;
function loginHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        const { success, error } = zod_1.zodLogin.safeParse(body);
        if (!success) {
            res.status(411).json({
                message: message_1.messages.invalidInput,
            });
            return;
        }
        try {
            let isCorrect;
            const user = yield prisma.user.findUnique({
                where: {
                    username: body.username,
                },
                select: {
                    username: true,
                    password: true,
                },
            });
            if (user != null) {
                isCorrect = yield bcrypt_1.default.compare(body.password, user.password);
                if (isCorrect && process.env.JWT_SECRET_KEY) {
                    let token = jsonwebtoken_1.default.sign({
                        username: user.username,
                    }, process.env.JWT_SECRET_KEY);
                    res.status(200).json({
                        message: token,
                    });
                }
                else {
                    res.status(411).json({
                        message: message_1.messages.invalidInput,
                    });
                }
            }
            else {
                res.status(411).json({
                    message: message_1.messages.invalidInput,
                });
            }
        }
        catch (e) {
            failureMessage(res, message_1.messages.failure);
        }
    });
}
exports.loginHandler = loginHandler;
function isUserFound(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.user.findUnique({
            where: {
                username: username,
            },
            select: {
                username: true,
            },
        });
        return result === null;
    });
}
exports.isUserFound = isUserFound;
function failureMessage(res, msg) {
    res.status(500).json({
        message: msg,
    });
}
exports.failureMessage = failureMessage;
