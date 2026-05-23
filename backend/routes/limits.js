const express = require("express");
const router = express.Router();
const db = require("../db/database");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const result = await db.query(
    `
    SELECT l.*, c.name as category_name, c.type as category_type
    FROM limits l
    JOIN categories c ON l.category_id = c.id
    WHERE l.user_id = $1
  `,
    [req.userId],
  );
  res.json(result.rows);
});

router.post("/", auth, async (req, res) => {
  const { category_id, amount, period } = req.body;
  if (!category_id || !amount)
    return res.status(400).json({ error: "Заповніть всі поля" });
  const result = await db.query(
    "INSERT INTO limits (user_id, category_id, amount, period) VALUES ($1, $2, $3, $4) RETURNING id",
    [req.userId, category_id, amount, period || "monthly"],
  );
  res.json({ id: result.rows[0].id });
});

router.delete("/:id", auth, async (req, res) => {
  await db.query("DELETE FROM limits WHERE id=$1 AND user_id=$2", [
    req.params.id,
    req.userId,
  ]);
  res.json({ success: true });
});

module.exports = router;
