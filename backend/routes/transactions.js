const express = require("express");
const router = express.Router();
const db = require("../db/database");
const auth = require("../middleware/auth");

// Отримати всі транзакції
router.get("/", auth, (req, res) => {
  const transactions = db
    .prepare(
      `
    SELECT t.*, c.name as category_name
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ?
    ORDER BY t.date DESC
  `,
    )
    .all(req.userId);
  res.json(transactions);
});

// Додати транзакцію
router.post("/", auth, (req, res) => {
  const { category_id, amount, type, description, date } = req.body;
  if (!amount || !type || !date) {
    return res.status(400).json({ error: "Заповніть всі поля" });
  }
  const result = db
    .prepare(
      `
    INSERT INTO transactions (user_id, category_id, amount, type, description, date)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    )
    .run(req.userId, category_id, amount, type, description, date);

  res.json({ id: result.lastInsertRowid });
});

// Редагувати транзакцію
router.put("/:id", auth, (req, res) => {
  const { category_id, amount, type, description, date } = req.body;
  db.prepare(
    `
    UPDATE transactions SET category_id=?, amount=?, type=?, description=?, date=?
    WHERE id=? AND user_id=?
  `,
  ).run(
    category_id,
    amount,
    type,
    description,
    date,
    req.params.id,
    req.userId,
  );
  res.json({ success: true });
});

// Видалити транзакцію
router.delete("/:id", auth, (req, res) => {
  db.prepare("DELETE FROM transactions WHERE id=? AND user_id=?").run(
    req.params.id,
    req.userId,
  );
  res.json({ success: true });
});

module.exports = router;
