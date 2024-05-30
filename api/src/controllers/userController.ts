import express, {
  Response,
  Request,
  response,
  NextFunction,
  RequestHandler,
} from "express";

import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

import createHttpError from "http-errors";

import UserModel from "../models/userSchema";
import { assertIsDefine } from "../middlewares/assertIsDefine";

export interface IUser {
  username?: string | null | undefined;
  email?: string | null | undefined;
  password?: string | null | undefined;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const getCookieAuth = req.cookies.access_token;

    assertIsDefine("cookie", getCookieAuth);

    // Type assertion to JwtPayload (haven't used yet)
    const decoded = jwt.verify(
      getCookieAuth,
      process.env.SECRET!
    ) as JwtPayload;

    res.status(200).json(decoded.user);
  } catch (error) {
    next(error);
  }
};

// getRegister
export const getRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = await req.body;
    if (!username || !email || !password)
      throw createHttpError(400, "parameters missing");

    const existingUserEmail = await UserModel.findOne({ email: email });
    if (existingUserEmail)
      throw createHttpError(409, "email is already taken!");

    const existingUserUserName = await UserModel.findOne({
      username: username,
    });
    if (existingUserUserName)
      throw createHttpError(409, "username is already taken!");

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      // cPasswd: hashedPasswd,
    });

    console.log("registered user is:  ", user);

    // generating token
    const token = jwt.sign(
      {
        id: user._id,
        user: user,
      },
      process.env.SECRET!
    );

    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(user);
  } catch (error) {
    next(error);
  }
};

export const getLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = await req.body;

  try {
    if (!username || !password)
      throw createHttpError(400, "Parameters missing");

    const user = await UserModel.findOne({ username: username })
      .select("+password +email")
      .exec();

    if (!user) throw createHttpError(401, "invalid credentials");

    if (typeof password !== "string" || typeof user.password !== "string")
      throw new Error("Password or user password is not a string");

    const passwdMatch = await bcrypt.compare(password, user.password);

    if (!passwdMatch) throw createHttpError(401, "invalid credentials");

    // generating token
    const token = jwt.sign(
      {
        id: user!._id,
        user: user,
      },
      process.env.SECRET!
    );

    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    // const expiryDate = new Date(Date.now() + 30000); // 30 seconds
    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(user);
  } catch (error) {
    next(error);
  }
};

export const getLogout: RequestHandler = (req, res, next) => {
  // will destroy the session here....
  req.session.destroy((error: any) => {
    if (error) {
      next(error);
    } else {
      res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "User Logged out successfully" });
    }
  });
};
