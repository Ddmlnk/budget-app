const express = require("express");
const router = express.Router();
const db = require("../db/database");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const result = await db.query("SELECT * FROM categories WHERE user_id = $1", [
    req.userId,
  ]);
  res.json(result.rows);
});

router.post("/", auth, async (req, res) => {
  const { name, type } = req.body;
  if (!name || !type)
    return res.status(400).json({ error: "Заповніть всі поля" });
  const result = await db.query(
    "INSERT INTO categories (user_id, name, type) VALUES ($1, $2, $3) RETURNING id",
    [req.userId, name, type],
  );
  res.json({ id: result.rows[0].id, name, type });
});

router.delete("/:id", auth, async (req, res) => {
  await db.query("DELETE FROM categories WHERE id=$1 AND user_id=$2", [
    req.params.id,
    req.userId,
  ]);
  res.json({ success: true });
});

module.exports = router;
