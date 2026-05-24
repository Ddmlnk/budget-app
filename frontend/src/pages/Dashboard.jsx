import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useBudget } from "../context/BudgetContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#6c5ce7",
  "#00b894",
  "#e17055",
  "#0984e3",
  "#fdcb6e",
  "#e84393",
];

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const { activeOwner } = useBudget();

  useEffect(() => {
    const params = activeOwner ? `?owner_id=${activeOwner.id}` : "";
    axios
      .get(`/api/transactions${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTransactions(res.data));
  }, [activeOwner]);

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  const getBarData = () => {
    const months = {};
    transactions.forEach((t) => {
      const month = t.date.slice(0, 7);
      if (!months[month]) months[month] = { month, income: 0, expense: 0 };
      if (t.type === "income") months[month].income += t.amount;
      else months[month].expense += t.amount;
    });
    return Object.values(months).slice(-6);
  };

  const getPieData = () => {
    const cats = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const n = t.category_name || "Інше";
        if (!cats[n]) cats[n] = { name: n, value: 0 };
        cats[n].value += t.amount;
      });
    return Object.values(cats);
  };

  const fmt = (n) => n.toLocaleString("uk-UA") + " ₴";

  return (
    <div style={styles.page}>
      {activeOwner && (
        <div style={styles.banner}>
          👁️ Перегляд бюджету: <b>{activeOwner.name}</b>
        </div>
      )}

      <h2 style={styles.title}>
        {activeOwner ? `Бюджет ${activeOwner.name}` : `Вітаємо, ${name}! 👋`}
      </h2>

      <div style={styles.cards}>
        <div style={{ ...styles.card, borderTop: "4px solid #6c5ce7" }}>
          <p style={styles.cardLabel}>Баланс</p>
          <p
            style={{
              ...styles.cardValue,
              color: balance >= 0 ? "#00b894" : "#e17055",
            }}
          >
            {fmt(balance)}
          </p>
        </div>
        <div style={{ ...styles.card, borderTop: "4px solid #00b894" }}>
          <p style={styles.cardLabel}>Доходи</p>
          <p style={{ ...styles.cardValue, color: "#00b894" }}>{fmt(income)}</p>
        </div>
        <div style={{ ...styles.card, borderTop: "4px solid #e17055" }}>
          <p style={styles.cardLabel}>Витрати</p>
          <p style={{ ...styles.cardValue, color: "#e17055" }}>
            {fmt(expense)}
          </p>
        </div>
      </div>

      <div style={styles.charts}>
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Доходи і витрати по місяцях</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={getBarData()}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => fmt(v)} />
              <Bar
                dataKey="income"
                name="Доходи"
                fill="#00b894"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Витрати"
                fill="#e17055"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Витрати по категоріях</h3>
          {getPieData().length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={getPieData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {getPieData().map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={styles.empty}>Немає витрат</p>
          )}
        </div>
      </div>

      <div style={styles.tableBox}>
        <h3 style={styles.chartTitle}>Останні транзакції</h3>
        {transactions.length === 0 ? (
          <p style={styles.empty}>Транзакцій ще немає</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Опис</th>
                <th style={styles.th}>Категорія</th>
                <th style={styles.th}>Дата</th>
                <th style={styles.th}>Сума</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((t) => (
                <tr key={t.id}>
                  <td style={styles.td}>{t.description || "—"}</td>
                  <td style={styles.td}>{t.category_name || "—"}</td>
                  <td style={styles.td}>{t.date}</td>
                  <td
                    style={{
                      ...styles.td,
                      color: t.type === "income" ? "#00b894" : "#e17055",
                      fontWeight: "600",
                    }}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {fmt(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "32px", maxWidth: "1100px", margin: "0 auto" },
  banner: {
    backgroundColor: "#fff3cd",
    padding: "12px 20px",
    borderRadius: "10px",
    marginBottom: "16px",
    fontSize: "14px",
    color: "#856404",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "24px",
    color: "#2d3436",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  cardLabel: { fontSize: "13px", color: "#636e72", marginBottom: "8px" },
  cardValue: { fontSize: "26px", fontWeight: "700" },
  charts: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "24px",
  },
  chartBox: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  chartTitle: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#2d3436",
  },
  tableBox: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    fontSize: "13px",
    color: "#636e72",
    borderBottom: "1px solid #f0f0f0",
  },
  td: {
    padding: "12px",
    fontSize: "14px",
    color: "#2d3436",
    borderBottom: "1px solid #f5f5f5",
  },
  empty: {
    color: "#b2bec3",
    fontSize: "14px",
    textAlign: "center",
    padding: "40px 0",
  },
};

export default Dashboard;
