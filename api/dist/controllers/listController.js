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
exports.deleteTodo = exports.updateTodo = exports.createTodo = exports.getTodo = exports.getTodos = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const assertIsDefine_1 = require("../middlewares/assertIsDefine");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const listSchema_1 = __importDefault(require("../models/listSchema"));
const getTodos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getCookieAuth = req.cookies.access_token;
        // assertIsDefine("cookie", decoded.id);
        (0, assertIsDefine_1.assertIsDefine)("cookie", getCookieAuth);
        if (!process.env.SECRET)
            throw (0, http_errors_1.default)(404, " undefined secret key ");
        // Type assertion to JwtPayload (haven't used yet)
        const decoded = jsonwebtoken_1.default.verify(getCookieAuth, process.env.SECRET);
        const Todos = yield listSchema_1.default.find({ userId: decoded.id }).exec();
        res.status(200).json(Todos);
    }
    catch (error) {
        next(error);
    }
});
exports.getTodos = getTodos;
const getTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoId = req.params.todoId;
        const getCookieAuth = req.cookies.access_token;
        (0, assertIsDefine_1.assertIsDefine)("cookie", getCookieAuth);
        if (!process.env.SECRET)
            throw (0, http_errors_1.default)(404, " undefined secret key ");
        // Type assertion to JwtPayload (haven't used yet)
        const decoded = jsonwebtoken_1.default.verify(getCookieAuth, process.env.SECRET);
        console.log(decoded.id);
        if (!mongoose_1.default.isValidObjectId(todoId))
            throw (0, http_errors_1.default)(400, "invalid todo id");
        const newTodo = yield listSchema_1.default.findById(todoId).exec();
        if (!newTodo)
            throw (0, http_errors_1.default)(404, "todo not found");
        if (newTodo && newTodo.userId && !newTodo.userId.equals(decoded.id)) {
            throw (0, http_errors_1.default)(401, "you cannot access this todo");
        }
        res.status(201).json(newTodo);
    }
    catch (error) {
        next(error);
    }
});
exports.getTodo = getTodo;
const createTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { todoState, text, title } = req.body;
        const getCookieAuth = req.cookies.access_token;
        (0, assertIsDefine_1.assertIsDefine)("cookie", getCookieAuth);
        if (!title)
            throw (0, http_errors_1.default)(400, "todo must have a title");
        if (!process.env.SECRET)
            throw (0, http_errors_1.default)(404, " undefined secret key ");
        // Type assertion to JwtPayload (haven't used yet)
        const decoded = jsonwebtoken_1.default.verify(getCookieAuth, process.env.SECRET);
        if (!text)
            throw (0, http_errors_1.default)(400, "todo must have a text");
        const newTodo = yield listSchema_1.default.create({
            userId: decoded.id, //here we stored new property "userId" which has req.cookie.userId
            todoState,
            title,
            text,
        });
        res.status(201).json(newTodo);
    }
    catch (error) {
        next(error);
    }
});
exports.createTodo = createTodo;
const updateTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoId = req.params.todoId;
        const newTodoState = req.body.todoState;
        const newTitle = req.body.title;
        const newText = req.body.text;
        const getCookieAuth = req.cookies.access_token;
        (0, assertIsDefine_1.assertIsDefine)("cookie", getCookieAuth);
        if (!process.env.SECRET)
            throw (0, http_errors_1.default)(404, " undefined secret key ");
        // Type assertion to JwtPayload (haven't used yet)
        const decoded = jsonwebtoken_1.default.verify(getCookieAuth, process.env.SECRET);
        (0, assertIsDefine_1.assertIsDefine)("cookie", decoded.id);
        if (!mongoose_1.default.isValidObjectId(todoId))
            throw (0, http_errors_1.default)(400, "invalid todo id");
        const todo = yield listSchema_1.default.findById(todoId).exec();
        if (!todo)
            throw (0, http_errors_1.default)(404, "todo not found");
        if (todo && todo.userId && !todo.userId.equals(decoded.id)) {
            throw (0, http_errors_1.default)(401, "you cannot access this todo");
        }
        todo.todoState = newTodoState;
        todo.text = newText;
        todo.title = newTitle;
        const updateTodo = yield todo.save();
        res.status(201).json(updateTodo);
    }
    catch (error) {
        next(error);
    }
});
exports.updateTodo = updateTodo;
const deleteTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoId = req.params.todoId;
        const getCookieAuth = req.cookies.access_token;
        // assertIsDefine("cookie", decoded.id);
        (0, assertIsDefine_1.assertIsDefine)("cookie", getCookieAuth);
        if (!process.env.SECRET)
            throw (0, http_errors_1.default)(404, " undefined secret key ");
        // Type assertion to JwtPayload (haven't used yet)
        const decoded = jsonwebtoken_1.default.verify(getCookieAuth, process.env.SECRET);
        (0, assertIsDefine_1.assertIsDefine)("cookie", decoded.id);
        if (!mongoose_1.default.isValidObjectId(todoId))
            throw (0, http_errors_1.default)(400, "invalid todo id");
        const todo = yield listSchema_1.default.findById(todoId).exec();
        if (!todo)
            throw (0, http_errors_1.default)(404, "todo not found");
        if (todo && todo.userId && !todo.userId.equals(decoded.id)) {
            throw (0, http_errors_1.default)(401, "you cannot access this todo");
        }
        yield todo.deleteOne({ _id: todoId });
        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTodo = deleteTodo;
