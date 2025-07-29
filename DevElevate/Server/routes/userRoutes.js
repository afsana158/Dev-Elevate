import express from "express";
const router = express.Router();

import { registerUser, loginUser } from "../controller/userController.js";
import { loginValidator, signUpValidator } from "../middleware/Validators.js";

router.post("/signup", registerUser);

router.post("/login", loginUser);

export default router;
