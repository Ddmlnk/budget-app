const express = require("express");
const router = express.Router();
const db = require("../db/database");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const rows = await db.all_("SELECT * FROM categories WHERE user_id = ?", [
    req.userId,
  ]);
  res.json(rows);
});

router.post("/", auth, async (req, res) => {
  const { name, type } = req.body;
  if (!name || !type)
    return res.status(400).json({ error: "Заповніть всі поля" });
  const result = await db.run_(
    "INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)",
    [req.userId, name, type],
  );
  res.json({ id: result.lastID, name, type });
});

router.delete("/:id", auth, async (req, res) => {
  await db.run_("DELETE FROM categories WHERE id=? AND user_id=?", [
    req.params.id,
    req.userId,
  ]);
  res.json({ success: true });
});

module.exports = router;
