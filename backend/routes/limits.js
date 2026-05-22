const express = require("express");
const router = express.Router();
const db = require("../db/database");
const auth = require("../middleware/auth");

router.get("/", auth, (req, res) => {
  const limits = db
    .prepare(
      `
    SELECT l.*, c.name as category_name, c.type as category_type
    FROM limits l
    JOIN categories c ON l.category_id = c.id
    WHERE l.user_id = ?
  `,
    )
    .all(req.userId);
  res.json(limits);
});

router.post("/", auth, (req, res) => {
  const { category_id, amount, period } = req.body;
  if (!category_id || !amount)
    return res.status(400).json({ error: "Заповніть всі поля" });
  const result = db
    .prepare(
      "INSERT INTO limits (user_id, category_id, amount, period) VALUES (?, ?, ?, ?)",
    )
    .run(req.userId, category_id, amount, period || "monthly");
  res.json({ id: result.lastInsertRowid });
});

router.delete("/:id", auth, (req, res) => {
  db.prepare("DELETE FROM limits WHERE id=? AND user_id=?").run(
    req.params.id,
    req.userId,
  );
  res.json({ success: true });
});

module.exports = router;
