"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const APIError_1 = require("../errors/APIError");
const errorHandler = (error, req, res, next) => {
    if (error instanceof mongoose_1.default.Error) {
        res.status(400).json({ message: error.message });
        return;
    }
    if (error instanceof APIError_1.APIError) {
        res.status(400).json({ message: error.message });
        return;
    }
    res.status(500).json({ message: "Internal Server Error" });
};
exports.errorHandler = errorHandler;
