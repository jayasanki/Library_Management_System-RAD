"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookController_1 = require("../controllers/bookController");
const authenticateToken_1 = require("../middleware/authenticateToken");
const bookRoute = (0, express_1.Router)();
bookRoute.get('/', bookController_1.getAllBooks, authenticateToken_1.authenticateToken); // View all books
bookRoute.post('/', bookController_1.addBook); // Add a book
bookRoute.put('/:id', bookController_1.updateBook); // Update book
bookRoute.delete('/:id', bookController_1.deleteBook); // Delete book
exports.default = bookRoute;
