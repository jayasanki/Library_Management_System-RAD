"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lendingController_1 = require("../controllers/lendingController");
const authenticateToken_1 = require("../middleware/authenticateToken");
const lendingRoutes = (0, express_1.Router)();
lendingRoutes.get('/', authenticateToken_1.authenticateToken, lendingController_1.getAllLendings); // Fixed order
lendingRoutes.post('/lend', authenticateToken_1.authenticateToken, lendingController_1.lendBook); // Added authentication
lendingRoutes.put('/return/:id', authenticateToken_1.authenticateToken, lendingController_1.returnBook); // Added authentication
exports.default = lendingRoutes;
