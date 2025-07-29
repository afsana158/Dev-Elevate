import express from "express";
const router = express.Router();

import { registerUser, loginUser } from "../controller/userController.js";
import { loginValidator, signUpValidator } from "../middleware/Validators.js";

router.route("/signup").post(registerUser)

router.route("/login").post(loginUser)
export default router;
