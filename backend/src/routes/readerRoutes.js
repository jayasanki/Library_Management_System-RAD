"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const readerController_1 = require("../controllers/readerController");
const authenticateToken_1 = require("../middleware/authenticateToken");
const readerRouter = (0, express_1.Router)();
readerRouter.get('/', authenticateToken_1.authenticateToken, readerController_1.getAllReaders); // View all readers
readerRouter.post('/', readerController_1.addReader); // Add reader
readerRouter.put('/:id', readerController_1.updateReader); // Update reader
readerRouter.delete('/:id', readerController_1.deleteReader); // Delete reader
exports.default = readerRouter;
