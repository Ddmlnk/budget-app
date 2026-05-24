const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db/database");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Роути
app.use("/api/auth", authRoutes);

// Тестовий маршрут
app.get("/", (req, res) => {
  res.json({ message: "Сервер працює!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});

const transactionRoutes = require("./routes/transactions");
app.use("/api/transactions", transactionRoutes);

const categoryRoutes = require("./routes/categories");
app.use("/api/categories", categoryRoutes);

const limitRoutes = require("./routes/limits");
app.use("/api/limits", limitRoutes);

const shareRoutes = require("./routes/share");
app.use("/api/share", shareRoutes);
