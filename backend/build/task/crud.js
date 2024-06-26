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
exports.deleteAccount = exports.deleteTodo = exports.updateTodo = exports.addTask = exports.getTasks = void 0;
const crud_1 = require("../user/crud");
const message_1 = require("../message");
function getTasks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const username = getUsername(req);
            const prisma = req.body.prisma;
            const tasks = yield prisma.user.findUnique({
                where: {
                    username: username,
                },
                select: {
                    tasks: true,
                },
            });
            res.status(200).json({
                message: tasks,
            });
        }
        catch (e) {
            (0, crud_1.failureMessage)(res, message_1.messages.failure);
        }
    });
}
exports.getTasks = getTasks;
function addTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const username = getUsername(req);
            const prisma = req.body.prisma;
            const task = req.body.task;
            const response = yield prisma.task.create({
                data: {
                    title: task.title,
                    description: task.description,
                    type: task.type,
                    dueDate: new Date(task.dueDate),
                    username: username,
                },
            });
            console.log(response);
            res.status(200).json({
                message: true,
            });
        }
        catch (e) {
            console.log(e);
            (0, crud_1.failureMessage)(res, message_1.messages.failure);
        }
    });
}
exports.addTask = addTask;
function updateTodo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const username = getUsername(req);
            const prisma = req.body.prisma;
            const task = req.body.task;
            const response = yield prisma.task.update({
                where: {
                    id: task.id,
                },
                data: {
                    title: task.title,
                    description: task.description,
                    type: task.type,
                    dueDate: new Date(task.dueDate),
                    username: username,
                },
            });
            console.log(response);
            res.status(200).json({
                message: true,
            });
        }
        catch (e) {
            console.log(e);
            (0, crud_1.failureMessage)(res, message_1.messages.failure);
        }
    });
}
exports.updateTodo = updateTodo;
function deleteTodo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const task = req.body.task;
            const prisma = req.body.prisma;
            const response = yield prisma.task.delete({
                where: {
                    id: task.id,
                },
            });
            console.log(response);
            res.status(200).json({
                message: true,
            });
        }
        catch (e) {
            console.log(e);
            (0, crud_1.failureMessage)(res, message_1.messages.failure);
        }
    });
}
exports.deleteTodo = deleteTodo;
function deleteAccount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const username = getUsername(req);
            const prisma = req.body.prisma;
            const response1 = yield prisma.task.deleteMany({
                where: {
                    username,
                },
            });
            const response2 = yield prisma.user.deleteMany({
                where: {
                    username,
                },
            });
            console.log(response1);
            console.log(response2);
            res.status(200).json({
                message: true,
            });
        }
        catch (e) {
            console.log(e);
            (0, crud_1.failureMessage)(res, message_1.messages.failure);
        }
    });
}
exports.deleteAccount = deleteAccount;
function getUsername(req) {
    return req.body.decode.username;
}
