import express from "express";

const router = express.Router();

import { getRegister } from "../controllers/userController";

router.get("/register").post(getRegister)


export default router