"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tweetControllers_1 = require("../controllers/tweetControllers");
const ProtectRutes_1 = __importDefault(require("../middlewares/ProtectRutes"));
const router = express_1.default.Router();
router.route("/test").get(ProtectRutes_1.default, tweetControllers_1.testAuth);
exports.default = router;
