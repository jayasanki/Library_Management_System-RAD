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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'apsaralihini11@gmail.com',
        // user: process.env.EMAIL_USER,
        pass: 'zgaorzqgmvsjgvpp',
        // pass: process.env.EMAIL_PASSWORD
    },
});
const mailOptions = {
    from: process.env.EMAIL_USER,
    to: '',
    subject: '',
    text: '',
};
const sendEmail = (req, res, err) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqMailOptions = req.body;
        mailOptions.subject = reqMailOptions.subject;
        mailOptions.text = reqMailOptions.body;
        mailOptions.to = reqMailOptions.to;
        yield transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    }
    catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});
exports.sendEmail = sendEmail;
