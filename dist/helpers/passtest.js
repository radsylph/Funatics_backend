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
const Usuario_js_1 = __importDefault(require("../models/Usuario.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const verifyPassword = (password, user_info) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = yield Usuario_js_1.default.findOne({
        $or: [{ email: user_info }, { username: user_info }],
    }).exec();
    console.log(usuario);
    if (!usuario) {
        return false;
    }
    const result = yield bcrypt_1.default.compare(password, usuario.password);
    console.log(result);
    return result;
});
exports.default = verifyPassword;
