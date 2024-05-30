import express from "express";

const router = express.Router();

import { getRegister,getLogin,getLogout ,getAuthenticatedUser } from "../controllers/userController";
import { verifyToken } from "../middlewares/verifyJwtCookie";

// authenticate
router.get("/", verifyToken, getAuthenticatedUser);

// Registration
router.route("/register").post(getRegister)
// login
router.route("/login").post(getLogin)
// logout
router.route("/logout").post(getLogout)


export default router