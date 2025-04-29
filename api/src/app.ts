// app.ts
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import createHttpError, { isHttpError } from "http-errors";
import cookieParser from "cookie-parser";
import path from "path";

import dotenv from "dotenv";
// dotenv.config({ path: "../.env" });
dotenv.config(); // No need to specify a path in Docker

import userRouter from "./routes/userRoutes";
import listRouter from "./routes/listRoutes";
import { verifyToken } from "./middlewares/verifyJwtCookie";

const app: Express = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

const FRONTEND_APP = process.env.FRONTEND_APP;

// app.use(cors());
// ✅ CORS setup to allow frontend from Vercel to access backend
app.use(
  cors({
    origin: FRONTEND_APP, // 🔁 Replace with your actual Vercel URL
    credentials: true,
  })
);

app.enable("trust proxy");

let pathToIndex = path.dirname(path.resolve());

if (process.env.ENV_FOR_DOCKER == "true") {
  pathToIndex = path.resolve();
  console.log(" For_Docker_Container / production ");
}

// const parentDirname = path.dirname(pathToIndex);
// console.log("parentDirname ", parentDirname);
// const newPath = path.join(parentDirname, path.basename(pathToIndex));
// console.log("newPath ", newPath);

// routes
app.use("/api/users", userRouter);
app.use("/api/todos", verifyToken, listRouter);

// use the frontend static files
console.log("Using the Frontend static files");
app.use(express.static(path.join(pathToIndex, "/app/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(pathToIndex, "/app/dist/index.html"));
});

// get
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// end point middleware
app.use((res, req, next) => {
  next(createHttpError(404, "endpoint not found"));
});

// error handler middleware
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error("👺[error log]:", error);

  let errorMessage = "an unknown error occurred";
  let statusCode = 500;
  let success = false;

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }

  res.status(statusCode).json({
    success,
    message: errorMessage,
    statusCode,
  });
});

export default app;
