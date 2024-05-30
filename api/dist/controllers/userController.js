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
exports.getLogout = exports.getLogin = exports.getRegister = exports.getAuthenticatedUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const assertIsDefine_1 = require("../middlewares/assertIsDefine");
const getAuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getCookieAuth = req.cookies.access_token;
        (0, assertIsDefine_1.assertIsDefine)("cookie", getCookieAuth);
        // Type assertion to JwtPayload (haven't used yet)
        const decoded = jsonwebtoken_1.default.verify(getCookieAuth, process.env.SECRET);
        res.status(200).json(decoded.user);
    }
    catch (error) {
        next(error);
    }
});
exports.getAuthenticatedUser = getAuthenticatedUser;
// getRegister
const getRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = yield req.body;
        if (!username || !email || !password)
            throw (0, http_errors_1.default)(400, "parameters missing");
        const existingUserEmail = yield userSchema_1.default.findOne({ email: email });
        if (existingUserEmail)
            throw (0, http_errors_1.default)(409, "email is already taken!");
        const existingUserUserName = yield userSchema_1.default.findOne({
            username: username,
        });
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
        }, process.env.SECRET);
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        res
            .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
            .status(200)
            .json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getRegister = getRegister;
const getLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = yield req.body;
    try {
        if (!username || !password)
            throw (0, http_errors_1.default)(400, "Parameters missing");
        const user = yield userSchema_1.default.findOne({ username: username })
            .select("+password +email")
            .exec();
        if (!user)
            throw (0, http_errors_1.default)(401, "invalid credentials");
        if (typeof password !== "string" || typeof user.password !== "string")
            throw new Error("Password or user password is not a string");
        const passwdMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwdMatch)
            throw (0, http_errors_1.default)(401, "invalid credentials");
        // generating token
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            user: user,
        }, process.env.SECRET);
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        // const expiryDate = new Date(Date.now() + 30000); // 30 seconds
        res
            .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
            .status(200)
            .json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getLogin = getLogin;
const getLogout = (req, res, next) => {
    // will destroy the session here....
    req.session.destroy((error) => {
        if (error) {
            next(error);
        }
        else {
            res
                .clearCookie("access_token")
                .status(200)
                .json({ message: "User Logged out successfully" });
        }
    });
};
exports.getLogout = getLogout;
