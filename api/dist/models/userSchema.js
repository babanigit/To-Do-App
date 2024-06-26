"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        select: false
    },
    password: {
        type: String,
        require: true,
        select: false
    }
}, {
    timestamps: true,
});
const UserModel = mongoose_1.default.model("UserData", userSchema);
exports.default = UserModel;
