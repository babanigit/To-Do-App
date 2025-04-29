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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const http_errors_1 = __importStar(require("http-errors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// dotenv.config({ path: "../.env" });
dotenv_1.default.config(); // No need to specify a path in Docker
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const listRoutes_1 = __importDefault(require("./routes/listRoutes"));
const verifyJwtCookie_1 = require("./middlewares/verifyJwtCookie");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
const FRONTEND_APP = process.env.FRONTEND_APP;
// app.use(cors());
// ✅ CORS setup to allow frontend from Vercel to access backend
app.use((0, cors_1.default)({
    origin: FRONTEND_APP, // 🔁 Replace with your actual Vercel URL
    credentials: true,
}));
app.enable("trust proxy");
let pathToIndex = path_1.default.dirname(path_1.default.resolve());
if (process.env.ENV_FOR_DOCKER == "true") {
    pathToIndex = path_1.default.resolve();
    console.log(" For_Docker_Container / production ");
}
// const parentDirname = path.dirname(pathToIndex);
// console.log("parentDirname ", parentDirname);
// const newPath = path.join(parentDirname, path.basename(pathToIndex));
// console.log("newPath ", newPath);
// routes
app.use("/api/users", userRoutes_1.default);
app.use("/api/todos", verifyJwtCookie_1.verifyToken, listRoutes_1.default);
// use the frontend static files
console.log("Using the Frontend static files");
app.use(express_1.default.static(path_1.default.join(pathToIndex, "/app/dist")));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(pathToIndex, "/app/dist/index.html"));
});
// get
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
// end point middleware
app.use((res, req, next) => {
    next((0, http_errors_1.default)(404, "endpoint not found"));
});
// error handler middleware
app.use((error, req, res, next) => {
    console.error("👺[error log]:", error);
    let errorMessage = "an unknown error occurred";
    let statusCode = 500;
    let success = false;
    if ((0, http_errors_1.isHttpError)(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({
        success,
        message: errorMessage,
        statusCode,
    });
});
exports.default = app;
