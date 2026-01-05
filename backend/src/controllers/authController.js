"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.logout = exports.refreshToken = exports.getAllUsers = exports.login = exports.signUp = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const user_1 = require("../models/user");
const APIError_1 = require("../errors/APIError");
const createAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.ACCESS_TOKEN_SECRET || 'default_access_token_secret_2024', { expiresIn: '70d' });
};
const createRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.REFRESH_TOKEN_SECRET || 'default_refresh_token_secret_2024', { expiresIn: '70d' });
};
// Register new user (admin use only)
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const exists = yield user_1.UserModel.findOne({ email });
        if (exists)
            throw new APIError_1.APIError(400, 'User already exists');
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = new user_1.UserModel({ name, email, password: hashedPassword });
        yield user.save();
        res.status(201).json({ message: 'User registered' });
    }
    catch (err) {
        next(err);
    }
});
exports.registerUser = registerUser;
// Sign up (alternative registration)
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = new user_1.UserModel({ name, email, password: hashedPassword });
        yield user.save();
        res.status(201).json(user);
    }
    catch (err) {
        next(err);
    }
});
exports.signUp = signUp;
// Login user
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.UserModel.findOne({ email });
        if (!user)
            throw new APIError_1.APIError(404, 'User not found');
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            throw new APIError_1.APIError(401, 'Invalid password');
        const accessToken = createAccessToken(user._id.toString());
        const refreshToken = createRefreshToken(user._id.toString());
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProd,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/auth/refresh-token',
        });
        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email: user.email,
        };
        res.status(200).json({ user: userWithoutPassword, accessToken });
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
// Get all users (admin use only)
const getAllUsers = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.UserModel.find(); // exclude password
        res.status(200).json(users);
    }
    catch (err) {
        next(err);
    }
});
exports.getAllUsers = getAllUsers;
// Refresh token - issue new access token
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
        if (!token)
            return next(new APIError_1.APIError(401, 'Refresh token missing'));
        jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET || 'default_refresh_token_secret_2024', (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                if (err instanceof jsonwebtoken_1.TokenExpiredError)
                    return next(new APIError_1.APIError(401, 'Refresh token expired'));
                if (err instanceof jsonwebtoken_1.JsonWebTokenError)
                    return next(new APIError_1.APIError(401, 'Invalid refresh token'));
                return next(new APIError_1.APIError(401, 'Could not verify refresh token'));
            }
            if (!decoded || typeof decoded === 'string')
                return next(new APIError_1.APIError(401, 'Invalid refresh token payload'));
            const userId = decoded.userId;
            const user = yield user_1.UserModel.findById(userId);
            if (!user)
                return next(new APIError_1.APIError(401, 'User not found'));
            const newAccessToken = createAccessToken(userId);
            res.status(200).json({ accessToken: newAccessToken });
        }));
    }
    catch (err) {
        next(err);
    }
});
exports.refreshToken = refreshToken;
// Logout - Clear refresh token cookie
const logout = (req, res, next) => {
    try {
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('refreshToken', '', {
            httpOnly: true,
            secure: isProduction,
            expires: new Date(0), // Set cookie expiration to past date
            path: '/api/auth/refresh-token',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.logout = logout;
