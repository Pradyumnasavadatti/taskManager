"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodLogin = exports.zodUsername = exports.zodUser = void 0;
const zod_1 = require("zod");
exports.zodUser = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string().min(5).max(15),
    fullname: zod_1.z.string().min(3).max(30),
});
exports.zodUsername = zod_1.z.string().email();
exports.zodLogin = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string().min(5).max(15),
});
