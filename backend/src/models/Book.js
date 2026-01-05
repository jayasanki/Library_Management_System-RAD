"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BookSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    language: { type: String, required: true },
    quantity: { type: Number, required: true },
    available: { type: Boolean, default: true },
});
exports.Book = mongoose_1.default.model('Book', BookSchema);
