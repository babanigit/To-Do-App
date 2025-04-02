// app.ts
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import createHttpError, { isHttpError } from "http-errors";
import cookieParser from "cookie-parser";
import path from "path";

import dotenv from "dotenv";
// dotenv.config({ path: "../.env" });
dotenv.config();  // No need to specify a path in Docker


import userRouter from "./routes/userRoutes";
import listRouter from "./routes/listRoutes";
import { verifyToken } from "./middlewares/verifyJwtCookie";

const app: Express = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.enable("trust proxy");

const bool: string | undefined = process.env.NODE_ENV || "production";

let pathToIndex = path.resolve();

if (bool !== "production") {
   pathToIndex = path.dirname(path.resolve());
  console.log("dirname2 ", pathToIndex);
}

const parentDirname = path.dirname(pathToIndex);
console.log("parentDirname ", parentDirname);

const newPath = path.join(parentDirname, path.basename(pathToIndex));
console.log("newPath ", newPath);

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
