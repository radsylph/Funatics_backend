"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAuth = void 0;
const testAuth = (req, res) => {
    res.status(200).json({
        message: "You are authenticated",
    });
};
exports.testAuth = testAuth;
