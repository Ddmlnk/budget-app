const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/database");

// Реєстрація
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Заповніть всі поля" });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    );
    const result = stmt.run(name, email, hashedPassword);

    // Одразу створюємо базові категорії для нового користувача
    const categories = [
      { name: "Зарплата", type: "income" },
      { name: "Фріланс", type: "income" },
      { name: "Продукти", type: "expense" },
      { name: "Транспорт", type: "expense" },
      { name: "Комунальні", type: "expense" },
      { name: "Розваги", type: "expense" },
    ];

    const catStmt = db.prepare(
      "INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)",
    );
    categories.forEach((c) =>
      catStmt.run(result.lastInsertRowid, c.name, c.type),
    );

    const token = jwt.sign(
      { userId: result.lastInsertRowid },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ token, name });
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(400).json({ error: "Email вже існує" });
    }
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// Вхід
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Заповніть всі поля" });
  }

  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: "Невірний email або пароль" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, name: user.name });
  } catch {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

module.exports = router;
