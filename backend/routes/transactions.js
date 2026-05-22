const express = require("express");
const router = express.Router();
const db = require("../db/database");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const rows = await db.all_(
    `
    SELECT t.*, c.name as category_name
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ?
    ORDER BY t.date DESC
  `,
    [req.userId],
  );
  res.json(rows);
});

router.post("/", auth, async (req, res) => {
  const { category_id, amount, type, description, date } = req.body;
  if (!amount || !type || !date)
    return res.status(400).json({ error: "Заповніть всі поля" });
  const result = await db.run_(
    "INSERT INTO transactions (user_id, category_id, amount, type, description, date) VALUES (?, ?, ?, ?, ?, ?)",
    [req.userId, category_id || null, amount, type, description, date],
  );
  res.json({ id: result.lastID });
});

router.put("/:id", auth, async (req, res) => {
  const { category_id, amount, type, description, date } = req.body;
  await db.run_(
    "UPDATE transactions SET category_id=?, amount=?, type=?, description=?, date=? WHERE id=? AND user_id=?",
    [
      category_id || null,
      amount,
      type,
      description,
      date,
      req.params.id,
      req.userId,
    ],
  );
  res.json({ success: true });
});

router.delete("/:id", auth, async (req, res) => {
  await db.run_("DELETE FROM transactions WHERE id=? AND user_id=?", [
    req.params.id,
    req.userId,
  ]);
  res.json({ success: true });
});

module.exports = router;
