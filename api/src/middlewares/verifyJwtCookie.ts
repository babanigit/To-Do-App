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

    if (!token) throw createHttpError(401, "You are not logged In (error from backend)");

    if (!process.env.SECRET)  throw createHttpError(404, " undefined secret key ");
    
    // verify token
    jwt.verify(token, process.env.SECRET, (err: any, user: any) => {
      if (err) throw createHttpError(403, "token is not valid! (error from backend) ");
      req.user = user;
      next();
    });

  } catch (error) {
    next(error);
  }
}
