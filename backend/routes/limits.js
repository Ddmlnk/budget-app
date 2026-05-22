const express = require("express");
const router = express.Router();
const db = require("../db/database");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const rows = await db.all_(
    `
    SELECT l.*, c.name as category_name, c.type as category_type
    FROM limits l
    JOIN categories c ON l.category_id = c.id
    WHERE l.user_id = ?
  `,
    [req.userId],
  );
  res.json(rows);
});

router.post("/", auth, async (req, res) => {
  const { category_id, amount, period } = req.body;
  if (!category_id || !amount)
    return res.status(400).json({ error: "Заповніть всі поля" });
  const result = await db.run_(
    "INSERT INTO limits (user_id, category_id, amount, period) VALUES (?, ?, ?, ?)",
    [req.userId, category_id, amount, period || "monthly"],
  );
  res.json({ id: result.lastID });
});

router.delete("/:id", auth, async (req, res) => {
  await db.run_("DELETE FROM limits WHERE id=? AND user_id=?", [
    req.params.id,
    req.userId,
  ]);
  res.json({ success: true });
});

module.exports = router;
