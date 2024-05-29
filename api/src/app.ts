
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import createHttpError, { isHttpError } from "http-errors";
// import session from "express-session";
// import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser"
import path from 'path';

// import { graphqlHTTP } from "express-graphql";

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

// import schema from "./schema/Schema"

const app: Express = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.enable('trust proxy')

// app.use("/graphql",graphqlHTTP({
//     schema,
//     graphiql:process.env.NODE_ENV === "development"
// }))

// const dirname = path.resolve();
const dirname = path.dirname(path.resolve());
// const parentDirname = path.dirname(dirname);
// const newPath = path.join(parentDirname, path.basename(dirname));
// console.log(newPath);


// routes


// use the frontend app
app.use(express.static(path.join(dirname, "/app/dist")));
console.log(dirname)
app.get('*', (req, res) => {
    res.sendFile(path.join(dirname, '/app/dist/index.html'));
});

// get
app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

// end point middleware
app.use((res, req, next) => {
    next(createHttpError(404, "endpoint not found"))
});

// error handler middleware
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {

    let errorMessage = "an unknown error occurred";
    let statusCode = 500;
    let success= false;

    console.error("👺[error log]:",error);

    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({
         error: errorMessage,
         success,
         statusCode
        });
});


export default app;