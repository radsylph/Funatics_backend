"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
mongoose_1.default.connect(`mongodb+srv://test1:123@cluster0.gpskocw.mongodb.net/funatics?retryWrites=true&w=majority`);
const db = mongoose_1.default.connection;
exports.default = db;
