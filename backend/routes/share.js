const express = require("express");
const router = express.Router();
const db = require("../db/database");
const auth = require("../middleware/auth");

// Запросити користувача по email
router.post("/invite", auth, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Вкажіть email" });

  try {
    // Знайти користувача по email
    const result = await db.query(
      "SELECT id, name FROM users WHERE email = $1",
      [email],
    );
    const user = result.rows[0];

    if (!user)
      return res.status(404).json({ error: "Користувача не знайдено" });
    if (user.id === req.userId)
      return res.status(400).json({ error: "Не можна запросити себе" });

    // Додати до спільного бюджету
    await db.query(
      "INSERT INTO shared_budgets (owner_id, member_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [req.userId, user.id],
    );

    res.json({ success: true, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Отримати список учасників
router.get("/members", auth, async (req, res) => {
  const result = await db.query(
    `
    SELECT u.id, u.name, u.email, s.created_at
    FROM shared_budgets s
    JOIN users u ON s.member_id = u.id
    WHERE s.owner_id = $1
  `,
    [req.userId],
  );
  res.json(result.rows);
});

// Видалити учасника
router.delete("/members/:id", auth, async (req, res) => {
  await db.query(
    "DELETE FROM shared_budgets WHERE owner_id = $1 AND member_id = $2",
    [req.userId, req.params.id],
  );
  res.json({ success: true });
});

// Отримати бюджети до яких я маю доступ
router.get("/access", auth, async (req, res) => {
  const result = await db.query(
    `
    SELECT u.id, u.name, u.email
    FROM shared_budgets s
    JOIN users u ON s.owner_id = u.id
    WHERE s.member_id = $1
  `,
    [req.userId],
  );
  res.json(result.rows);
});

module.exports = router;
