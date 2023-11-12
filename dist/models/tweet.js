"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tweetSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        default: null,
    },
    owner: {
        type: String,
        required: true,
        ref: "Usuario",
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        default: null,
    },
    edited: {
        type: Boolean,
        default: false,
    },
    isComment: {
        type: Boolean,
        default: false,
    },
    PostToComment: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});
const Tweet = mongoose_1.default.model("Tweet", tweetSchema);
exports.default = Tweet;
