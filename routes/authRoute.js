import express from "express";

import { Login, logout, userMe, Register } from "../controllers/auth.js";

const router = express.Router();

router.get("/me", userMe);
router.post("/login", Login);
router.post("/regist", Register);
router.delete("/logout", logout);

export default router;
