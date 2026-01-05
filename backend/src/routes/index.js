"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookRoutes_1 = __importDefault(require("./bookRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const readerRoutes_1 = __importDefault(require("./readerRoutes"));
const lendingRoutes_1 = __importDefault(require("./lendingRoutes"));
const notificationRoutes_1 = __importDefault(require("./notificationRoutes"));
const rootRouter = (0, express_1.Router)();
rootRouter.use("/auth", authRoutes_1.default);
rootRouter.use("/books", bookRoutes_1.default);
rootRouter.use("/readers", readerRoutes_1.default);
rootRouter.use("/lendings", lendingRoutes_1.default);
rootRouter.use("/notifications", notificationRoutes_1.default);
exports.default = rootRouter;
