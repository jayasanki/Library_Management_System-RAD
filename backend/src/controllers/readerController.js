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
exports.deleteReader = exports.updateReader = exports.addReader = exports.getAllReaders = void 0;
const Reader_1 = require("../models/Reader");
const APIError_1 = require("../errors/APIError");
const currentTime = () => new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo', hour12: true });
// Get all readers
const getAllReaders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readers = yield Reader_1.Reader.find();
        console.log(`[${currentTime()}] Fetched all readers: ${readers.length} records`);
        res.status(200).json(readers);
    }
    catch (error) {
        console.error(`[${currentTime()}] Error fetching readers:`, error);
        next(new APIError_1.APIError(500, 'Failed to fetch readers'));
    }
});
exports.getAllReaders = getAllReaders;
// Add new reader
const addReader = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newReader = new Reader_1.Reader(req.body);
        yield newReader.save();
        console.log(`[${currentTime()}] Added new reader: ${newReader.name || 'Unnamed'}`);
        res.status(201).json(newReader);
    }
    catch (error) {
        console.error(`[${currentTime()}] Error adding reader:`, error);
        next(new APIError_1.APIError(500, 'Failed to add reader'));
    }
});
exports.addReader = addReader;
// Update reader
const updateReader = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reader = yield Reader_1.Reader.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!reader) {
            console.log(`[${currentTime()}] Reader not found for update: ID ${req.params.id}`);
            return next(new APIError_1.APIError(404, 'Reader not found'));
        }
        console.log(`[${currentTime()}] Updated reader: ID ${req.params.id}`);
        res.status(200).json(reader);
    }
    catch (error) {
        console.error(`[${currentTime()}] Error updating reader ID ${req.params.id}:`, error);
        next(new APIError_1.APIError(500, 'Failed to update reader'));
    }
});
exports.updateReader = updateReader;
// Delete reader
const deleteReader = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reader = yield Reader_1.Reader.findByIdAndDelete(req.params.id);
        if (!reader) {
            console.log(`[${currentTime()}] Reader not found for deletion: ID ${req.params.id}`);
            return next(new APIError_1.APIError(404, 'Reader not found'));
        }
        console.log(`[${currentTime()}] Deleted reader: ID ${req.params.id}`);
        res.status(200).json({ message: 'Reader deleted successfully' });
    }
    catch (error) {
        console.error(`[${currentTime()}] Error deleting reader ID ${req.params.id}:`, error);
        next(new APIError_1.APIError(500, 'Failed to delete reader'));
    }
});
exports.deleteReader = deleteReader;
