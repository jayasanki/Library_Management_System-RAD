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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLendings = exports.returnBook = exports.lendBook = void 0;
const Lending_1 = require("../models/Lending");
const Book_1 = require("../models/Book");
const Reader_1 = require("../models/Reader"); // Reader model එක import කරන්න
const APIError_1 = require("../errors/APIError");
const uuid_1 = require("uuid");
const mongoose_1 = __importDefault(require("mongoose"));
const currentTime = () => new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo', hour12: true });
// Lend a book
const lendBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { readerId, bookId } = req.body;
        // Validate input
        if (!readerId || !bookId) {
            console.log(`[${currentTime()}] Missing readerId or bookId`);
            return next(new APIError_1.APIError(400, 'readerId and bookId are required'));
        }
        // Validate ObjectIds
        if (!mongoose_1.default.Types.ObjectId.isValid(readerId) || !mongoose_1.default.Types.ObjectId.isValid(bookId)) {
            console.log(`[${currentTime()}] Invalid readerId or bookId: ${readerId}, ${bookId}`);
            return next(new APIError_1.APIError(400, 'Invalid readerId or bookId format'));
        }
        // Check if reader exists
        const reader = yield Reader_1.Reader.findById(readerId);
        if (!reader) {
            console.log(`[${currentTime()}] Reader not found: ID ${readerId}`);
            return next(new APIError_1.APIError(404, 'Reader not found'));
        }
        // Check if book exists
        const book = yield Book_1.Book.findById(bookId);
        if (!book) {
            console.log(`[${currentTime()}] Book not found for lending: ID ${bookId}`);
            return next(new APIError_1.APIError(404, 'Book not found'));
        }
        // Check book quantity
        if (book.quantity <= 0) {
            console.log(`[${currentTime()}] Book out of stock: ID ${bookId}`);
            return next(new APIError_1.APIError(400, 'Book is out of stock'));
        }
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14); // due in 14 days
        const lending = new Lending_1.Lending({
            id: (0, uuid_1.v4)(), // Use uuidv4() for unique ID
            readerId,
            bookId,
            borrowedDate: new Date(),
            dueDate,
        });
        yield lending.save();
        // Decrease book quantity
        book.quantity -= 1;
        yield book.save();
        console.log(`[${currentTime()}] Book lent: ID ${bookId} to Reader ${readerId}`);
        res.status(201).json(lending);
    }
    catch (err) {
        console.error(`[${currentTime()}] Error lending book:`, err);
        if (err.name === 'ValidationError') {
            return next(new APIError_1.APIError(400, `Lending validation failed: ${err.message}`));
        }
        if (err.name === 'CastError') {
            return next(new APIError_1.APIError(400, 'Invalid readerId or bookId'));
        }
        next(new APIError_1.APIError(500, 'Failed to lend book'));
    }
});
exports.lendBook = lendBook;
// Return a book
const returnBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lending = yield Lending_1.Lending.findById(req.params.id);
        if (!lending) {
            console.log(`[${currentTime()}] Lending record not found: ID ${req.params.id}`);
            return next(new APIError_1.APIError(404, 'Lending record not found'));
        }
        if (lending.returned) {
            console.log(`[${currentTime()}] Book already returned: ID ${req.params.id}`);
            return next(new APIError_1.APIError(400, 'Book already returned'));
        }
        lending.returned = true;
        yield lending.save();
        // Increase book quantity
        const book = yield Book_1.Book.findById(lending.bookId);
        if (book) {
            book.quantity += 1;
            yield book.save();
        }
        console.log(`[${currentTime()}] Book returned: ID ${req.params.id}`);
        res.json({ message: 'Book returned successfully', lending });
    }
    catch (err) {
        console.error(`[${currentTime()}] Error returning book:`, err);
        next(new APIError_1.APIError(500, 'Failed to return book'));
    }
});
exports.returnBook = returnBook;
// Get all lending records
const getAllLendings = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield Lending_1.Lending.find().populate('readerId').populate('bookId');
        console.log(`[${currentTime()}] Fetched all lendings: ${records.length} records`);
        res.json(records);
    }
    catch (err) {
        console.error(`[${currentTime()}] Error fetching lendings:`, err);
        next(new APIError_1.APIError(500, 'Failed to fetch lendings'));
    }
});
exports.getAllLendings = getAllLendings;
