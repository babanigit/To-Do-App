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
exports.getRegister = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
// getRegister
const getRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = yield req.body;
        if (!username || !email || !password)
            throw (0, http_errors_1.default)(400, "parameters missing");
        const existingUserEmail = yield userSchema_1.default.findOne({ email: email });
        if (existingUserEmail)
            throw (0, http_errors_1.default)(409, "email is already taken!");
        const existingUserUserName = yield userSchema_1.default.findOne({ username: username });
        if (existingUserUserName)
            throw (0, http_errors_1.default)(409, "username is already taken!");
        // password hashing
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield userSchema_1.default.create({
            username,
            email,
            password: hashedPassword,
            // cPasswd: hashedPasswd,
        });
        console.log("registered user is:  ", user);
        // generating token
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            user: user,
        }, process.env.SECRET_WORD);
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        res
            .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
            .status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getRegister = getRegister;
