

import express from "express";
import * as TodoController from "../controllers/listController"
const router=express.Router()

router.route("/").get(TodoController.getTodos).post(TodoController.createTodo);
router.route("/:todoId").get(TodoController.getTodo).patch(TodoController.updateTodo).delete(TodoController.deleteTodo);

export default router;