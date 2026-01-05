"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.addBook = exports.getAllBooks = void 0;
const Book_1 = require("../models/Book");
const APIError_1 = require("../errors/APIError");
const currentTime = () => new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo', hour12: true });
//  Get all books
const getAllBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield Book_1.Book.find();
        console.log(`[${currentTime()}] Fetched all books: ${books.length} records`);
        res.json(books);
    }
    catch (err) {
        console.error(`[${currentTime()}] Error fetching books:`, err);
        next(new APIError_1.APIError(500, 'Failed to fetch books'));
    }
});
exports.getAllBooks = getAllBooks;
//  Add new book
const addBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, title, author, genre, language, quantity, available } = req.body;
        if (!id || !title || !author || !genre || !language || quantity == null) {
            console.log(`[${currentTime()}] Missing required fields`);
            return next(new APIError_1.APIError(400, 'All required fields must be provided'));
        }
        const newBook = new Book_1.Book({
            id,
            title,
            author,
            genre,
            language,
            quantity,
            available: available !== null && available !== void 0 ? available : true,
        });
        const savedBook = yield newBook.save();
        console.log(`[${currentTime()}] Added new book: ID ${savedBook.id}`);
        res.status(201).json(savedBook);
    }
    catch (err) {
        console.error(`[${currentTime()}] Error adding new book:`, err);
        next(new APIError_1.APIError(500, 'Failed to add new book'));
    }
});
exports.addBook = addBook;
//  Update book
const updateBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield Book_1.Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            console.log(`[${currentTime()}] Book not found for update: ID ${req.params.id}`);
            return next(new APIError_1.APIError(404, 'Book not found'));
        }
        console.log(`[${currentTime()}] Updated book: ID ${req.params.id}`);
        res.json(updated);
    }
    catch (err) {
        console.error(`[${currentTime()}] Error updating book ID ${req.params.id}:`, err);
        next(new APIError_1.APIError(500, 'Failed to update book'));
    }
});
exports.updateBook = updateBook;
//  Delete book
const deleteBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield Book_1.Book.findByIdAndDelete(req.params.id);
        if (!deleted) {
            console.log(`[${currentTime()}] Book not found for deletion: ID ${req.params.id}`);
            return next(new APIError_1.APIError(404, 'Book not found'));
        }
        console.log(`[${currentTime()}] Deleted book: ID ${req.params.id}`);
        res.json({ message: 'Book deleted successfully' });
    }
    catch (err) {
        console.error(`[${currentTime()}] Error deleting book ID ${req.params.id}:`, err);
        next(new APIError_1.APIError(500, 'Failed to delete book'));
    }
});
exports.deleteBook = deleteBook;
