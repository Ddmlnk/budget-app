const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/database");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Заповніть всі поля" });

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = await db.run_(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
    );

    const categories = [
      { name: "Зарплата", type: "income" },
      { name: "Фріланс", type: "income" },
      { name: "Продукти", type: "expense" },
      { name: "Транспорт", type: "expense" },
      { name: "Комунальні", type: "expense" },
      { name: "Розваги", type: "expense" },
    ];

    for (const c of categories) {
      await db.run_(
        "INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)",
        [result.lastID, c.name, c.type],
      );
    }

    const token = jwt.sign({ userId: result.lastID }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, name });
  } catch (err) {
    if (err.message.includes("UNIQUE"))
      return res.status(400).json({ error: "Email вже існує" });
    res.status(500).json({ error: "Помилка сервера" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Заповніть всі поля" });

  try {
    const user = await db.get_("SELECT * FROM users WHERE email = ?", [email]);
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
