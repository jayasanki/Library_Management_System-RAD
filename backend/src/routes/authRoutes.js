"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authenticateToken_1 = require("../middleware/authenticateToken");
const authRouter = (0, express_1.Router)();
// Public Routes
authRouter.post('/signup', authController_1.signUp);
authRouter.post('/login', authController_1.login);
authRouter.post('/refresh-token', authController_1.refreshToken);
authRouter.post('/logout', authController_1.logout);
// Admin Routes (Require Authentication)
authRouter.post('/register', authController_1.registerUser);
authRouter.get('/users', authenticateToken_1.authenticateToken, authController_1.getAllUsers);
exports.default = authRouter;
