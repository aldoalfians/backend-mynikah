import express from "express";
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articles.js";

const router = express.Router();

import { verifyUser, adminOnly } from "../middleware/authUser.js";

router.get("/article", verifyUser, getArticles);
router.get("/article/:id", verifyUser, getArticleById);
router.post("/article", adminOnly, verifyUser, createArticle);
router.patch("/article/:id", adminOnly, verifyUser, updateArticle);
router.delete("/article/:id", adminOnly, verifyUser, deleteArticle);

export default router;
