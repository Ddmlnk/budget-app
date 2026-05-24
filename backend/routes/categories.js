const express = require("express");
const router = express.Router();
const db = require("../db/database");
const auth = require("../middleware/auth");

const checkAccess = async (userId, ownerId) => {
  if (userId === parseInt(ownerId)) return true;
  const result = await db.query(
    "SELECT id FROM shared_budgets WHERE owner_id = $1 AND member_id = $2",
    [ownerId, userId],
  );
  return result.rows.length > 0;
};

router.get("/", auth, async (req, res) => {
  const ownerId = req.query.owner_id || req.userId;
  const hasAccess = await checkAccess(req.userId, ownerId);
  if (!hasAccess) return res.status(403).json({ error: "Немає доступу" });

  const result = await db.query("SELECT * FROM categories WHERE user_id = $1", [
    ownerId,
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
