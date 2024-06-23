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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUser = void 0;
const client_1 = require("@prisma/client");
const message_1 = require("../message");
const prisma = new client_1.PrismaClient();
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.body;
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
        catch (e) {
            failureMessage(res, message_1.messages.failure);
        }
    });
}
exports.getUser = getUser;
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield isUserFound(req.body.username)) {
            const user = req.body;
            if (user.username == "" || user.password == "" || user.fullname == "") {
                res.status(200).json({
                    message: message_1.messages.fillDetails,
                });
            }
            else {
                try {
                    const result = yield prisma.user.create({
                        data: user,
                    });
                    console.log(result);
                    res.status(200).json({
                        message: message_1.messages.userCreated,
                    });
                }
                catch (e) {
                    failureMessage(res, message_1.messages.failure);
                }
            }
        }
        else {
            failureMessage(res, message_1.messages.userFound);
        }
    });
}
exports.createUser = createUser;
function isUserFound(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        return result === null;
    });
}
function failureMessage(res, msg) {
    res.status(500).json({
        message: msg,
    });
}
