import { where } from "sequelize";
import Article from "../models/article.js";

export const getArticles = async (req, res) => {
  try {
    const response = await Article.findAll({
      attributes: [
        "uuid",
        "title",
        "content",
        "imageUrl",
        "createdAt",
        "updatedAt",
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findOne({
      where: {
        uuid: req.params.id,
      },
      attributes: [
        "uuid",
        "title",
        "content",
        "imageUrl",
        "createdAt",
        "updatedAt",
      ],
    });
    if (!article) return res.status(404).json({ msg: "data tidak ditemukan" });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createArticle = async (req, res) => {
  const { title, content, imageUrl } = req.body;
  try {
    await Article.create({
      title,
      content,
      imageUrl,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Artikel berhasil dibuat" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateArticle = async (req, res) => {
  const article = await Article.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!article) return res.status(404).json({ msg: "data tidak ditemukan" });
  const { title, content, imageUrl } = req.body;

  try {
    Article.update(
      {
        title,
        content,
        imageUrl,
      },
      {
        where: {
          id: article.id,
        },
      }
    );
    res.status(200).json({ msg: "Data berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  const article = await Article.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!article) return res.status(404).json({ msg: "data tidak ditemukan" });

  try {
    await Article.destroy({
      where: {
        id: article.id,
      },
    });
    res.status(200).json({ msg: "Data didelete" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
