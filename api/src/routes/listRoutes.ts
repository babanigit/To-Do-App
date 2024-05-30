

import express from "express";
import * as NotesController from "../controllers/listController"
const router=express.Router()

router.route("/").get(NotesController.getTodos).post(NotesController.createTodo);
router.route("/:noteId").get(NotesController.getTodo).patch(NotesController.updateTodo).delete(NotesController.deleteNote);

export default router;