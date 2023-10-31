"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Follow = exports.Like = exports.Usuario = exports.Tweet = void 0;
const tweet_1 = __importDefault(require("./tweet"));
exports.Tweet = tweet_1.default;
const Usuario_1 = __importDefault(require("./Usuario"));
exports.Usuario = Usuario_1.default;
const like_1 = __importDefault(require("./like"));
exports.Like = like_1.default;
const follow_1 = __importDefault(require("./follow"));
exports.Follow = follow_1.default;
