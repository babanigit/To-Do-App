import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";

// Define a new interface extending Request
interface AuthenticatedRequest extends Request {
  user?: any; // Define the user property
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;

    if (!token) throw createHttpError(401, "you are not authenticated! (MW)");

    if (!process.env.SECRET)  throw createHttpError(404, " undifiend secret key (MW)");
    
    // verify token
    jwt.verify(token, process.env.SECRET, (err: any, user: any) => {
      if (err) throw createHttpError(403, "token is not valid! (MW) ");
      req.user = user;
      next();
    });

  } catch (error) {
    next(error);
  }
}
