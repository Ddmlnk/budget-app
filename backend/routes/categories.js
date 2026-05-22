const express = require("express");
const router = express.Router();
const db = require("../db/database");
const auth = require("../middleware/auth");

router.get("/", auth, (req, res) => {
  const cats = db
    .prepare("SELECT * FROM categories WHERE user_id = ?")
    .all(req.userId);
  res.json(cats);
});

router.post("/", auth, (req, res) => {
  const { name, type } = req.body;
  if (!name || !type)
    return res.status(400).json({ error: "Заповніть всі поля" });
  const result = db
    .prepare("INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)")
    .run(req.userId, name, type);
  res.json({ id: result.lastInsertRowid, name, type });
});

router.delete("/:id", auth, (req, res) => {
  db.prepare("DELETE FROM categories WHERE id=? AND user_id=?").run(
    req.params.id,
    req.userId,
  );
  res.json({ success: true });
});

module.exports = router;
