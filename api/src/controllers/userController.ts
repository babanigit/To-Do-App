import express, { Response, Request, response, NextFunction, RequestHandler } from "express";
import { Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import createHttpError from "http-errors";

import UserModel from "../models/userSchema";




// getRegister
export const getRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = await req.body;
        if (!username || !email || !password)
            throw createHttpError(400, "parameters missing");

        const existingUserEmail = await UserModel.findOne({ email: email });
        if (existingUserEmail)
            throw createHttpError(409, "email is already taken!")

        const existingUserUserName = await UserModel.findOne({ username: username });
        if (existingUserUserName)
            throw createHttpError(409, "username is already taken!")

        // password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            // cPasswd: hashedPasswd,
        });

        console.log("registered user is:  ", user)

        // generating token
        const token = jwt.sign(
            {
                id: user._id,
                user: user,
            },
            process.env.SECRET_WORD!
        );

        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        res
            .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
            .status(200).json(user);

    } catch (error) {
        next(error)
    }
};