import { NextFunction, Request, RequestHandler, Response } from "express";

import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefine } from "../middlewares/assertIsDefine";

import jwt from "jsonwebtoken";

interface ITodo {
  todoState?: boolean;
  text?: string;
  // userId?:string;
}

import { JwtPayload } from "jsonwebtoken";
import TodoModel from "../models/listSchema";
import { text } from "stream/consumers";

export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const getCookieAuth = req.cookies.access_token;

    // assertIsDefine("cookie", decoded.id);
    assertIsDefine("cookie", getCookieAuth);

    if (!process.env.SECRET)
      throw createHttpError(404, " undefined secret key ");

    // Type assertion to JwtPayload (haven't used yet)
    const decoded = jwt.verify(getCookieAuth, process.env.SECRET) as JwtPayload;

    const notes = await TodoModel.find({ userId: decoded.id }).exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todoId = req.params.todoId;
    const getCookieAuth = req.cookies.access_token;

    assertIsDefine("cookie", getCookieAuth);

    if (!process.env.SECRET)
      throw createHttpError(404, " undefined secret key ");

    // Type assertion to JwtPayload (haven't used yet)
    const decoded = jwt.verify(
      getCookieAuth,
      process.env.SECRET!
    ) as JwtPayload;
    console.log(decoded.id);

    if (!mongoose.isValidObjectId(todoId))
      throw createHttpError(400, "invalid todo id");

    const newTodo = await TodoModel.findById(todoId).exec();
    if (!newTodo) throw createHttpError(404, "todo not found");

    if (newTodo && newTodo.userId && !newTodo.userId.equals(decoded.id)) {
      throw createHttpError(401, "you cannot access this todo");
    }

    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
};

export const createTodo: RequestHandler<
  unknown,
  unknown,
  ITodo,
  unknown
> = async (req, res, next) => {
  try {
    const { todoState, text }: ITodo = req.body;
    const getCookieAuth = req.cookies.access_token;

    assertIsDefine("cookie", getCookieAuth);

    if (!process.env.SECRET)
      throw createHttpError(404, " undefined secret key ");

    // Type assertion to JwtPayload (haven't used yet)
    const decoded = jwt.verify(
      getCookieAuth,
      process.env.SECRET!
    ) as JwtPayload;

    if (!text) throw createHttpError(400, "todo must have a text");
    const newTodo = await TodoModel.create({
      userId: decoded.id, //here we stored new property "userId" which has req.cookie.userId
      todoState,
      text,
    });
    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
};

export const updateTodo: RequestHandler = async (req, res, next) => {
  try {
    const todoId = req.params.todoId;
    const newTodoState = req.body.title;
    const newText = req.body.text;
    const getCookieAuth = req.cookies.access_token;

    assertIsDefine("cookie", getCookieAuth);

    if (!process.env.SECRET)
      throw createHttpError(404, " undefined secret key ");

    // Type assertion to JwtPayload (haven't used yet)
    const decoded = jwt.verify(
      getCookieAuth,
      process.env.SECRET!
    ) as JwtPayload;

    assertIsDefine("cookie", decoded.id);

    if (!mongoose.isValidObjectId(todoId))
      throw createHttpError(400, "invalid todo id");
    if (!text) throw createHttpError(400, "todo must have a title");

    const todo = await TodoModel.findById(todoId).exec();

    if (!todo) throw createHttpError(404, "todo not found");

    if (todo && todo.userId && !todo.userId.equals(decoded.id)) {
      throw createHttpError(401, "you cannot access this todo");
    }

    todo.todoState = newTodoState;
    todo.text = newText;

    const updateTodo = await todo.save();
    res.status(201).json(updateTodo);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  try {
    const todoId = req.params.todoId;
    const getCookieAuth = req.cookies.access_token;

    // assertIsDefine("cookie", decoded.id);
    assertIsDefine("cookie", getCookieAuth);

    if (!process.env.SECRET)
      throw createHttpError(404, " undefined secret key ");

    // Type assertion to JwtPayload (haven't used yet)
    const decoded = jwt.verify(
      getCookieAuth,
      process.env.SECRET!
    ) as JwtPayload;

    assertIsDefine("cookie", decoded.id);
    if (!mongoose.isValidObjectId(todoId))
      throw createHttpError(400, "invalid todo id");

    const todo = await TodoModel.findById(todoId).exec();

    if (!todo) throw createHttpError(404, "todo not found");

    if (todo && todo.userId && !todo.userId.equals(decoded.id)) {
      throw createHttpError(401, "you cannot access this todo");
    }

    await todo.deleteOne({ _id: todoId });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
