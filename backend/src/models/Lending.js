"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lending = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const LendingSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: true
    },
    readerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Reader',
        required: true
    },
    bookId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    borrowedDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    returned: {
        type: Boolean,
    },
    returnDate: {
        type: Date,
    }
});
exports.Lending = mongoose_1.default.model('Lending', LendingSchema);
