import express from "express";

import { Login, logout, userMe } from "../controllers/auth.js";

const router = express.Router();

router.get("/me", userMe);
router.post("/login", Login);
router.delete("/logout", logout);

export default router;
