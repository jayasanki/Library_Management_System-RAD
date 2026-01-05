"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const emailRouter = (0, express_1.Router)();
emailRouter.post("/", notificationController_1.sendEmail);
exports.default = emailRouter;
