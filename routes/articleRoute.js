import express from "express";
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articles.js";

const router = express.Router();

router.get("/article", getArticles);
router.get("/article/:id", getArticleById);
router.post("/article", createArticle);
router.patch("/article/:id", updateArticle);
router.delete("/article/:id", deleteArticle);

export default router;
