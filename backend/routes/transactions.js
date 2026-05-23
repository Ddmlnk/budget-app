const express = require("express");
const router = express.Router();
const db = require("../db/database");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const result = await db.query(
    `
    SELECT t.*, c.name as category_name
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = $1
    ORDER BY t.date DESC
  `,
    [req.userId],
  );
  res.json(result.rows);
});

router.post("/", auth, async (req, res) => {
  const { category_id, amount, type, description, date } = req.body;
  if (!amount || !type || !date)
    return res.status(400).json({ error: "Заповніть всі поля" });
  const result = await db.query(
    "INSERT INTO transactions (user_id, category_id, amount, type, description, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
    [req.userId, category_id || null, amount, type, description, date],
  );
  res.json({ id: result.rows[0].id });
});

router.put("/:id", auth, async (req, res) => {
  const { category_id, amount, type, description, date } = req.body;
  await db.query(
    "UPDATE transactions SET category_id=$1, amount=$2, type=$3, description=$4, date=$5 WHERE id=$6 AND user_id=$7",
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
  await db.query("DELETE FROM transactions WHERE id=$1 AND user_id=$2", [
    req.params.id,
    req.userId,
  ]);
  res.json({ success: true });
});

module.exports = router;
