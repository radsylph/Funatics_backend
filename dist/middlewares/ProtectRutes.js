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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Usuario_js_1 = __importDefault(require("../models/Usuario.js"));
const getUserInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Token is required",
            status: 401,
        });
    }
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        if (!decoded || !decoded.id) {
            throw new Error("Invalid token payload");
        }
        const user = yield Usuario_js_1.default.findById(decoded.id);
        console.log(user);
        if (user) {
            req.user = user;
        }
        else {
            return res.status(400).json({
                message: "User not found",
                status: 400,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "you have to login again",
            status: 500,
        });
    }
    next();
});
exports.default = getUserInfo;
