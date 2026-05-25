import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useBudget } from "../context/BudgetContext";

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function Limits() {
  const [limits, setLimits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    category_id: "",
    amount: "",
    period: "monthly",
  });
  const { activeOwner } = useBudget();

  const load = async () => {
    const ownerParam = activeOwner ? `?owner_id=${activeOwner.id}` : "";
    const [l, c, t] = await Promise.all([
      axios.get(`/api/limits${ownerParam}`, { headers: headers() }),
      axios.get(`/api/categories${ownerParam}`, { headers: headers() }),
      axios.get(`/api/transactions${ownerParam}`, { headers: headers() }),
    ]);
    setLimits(l.data);
    setCategories(c.data.filter((c) => c.type === "expense"));
    setTransactions(t.data);
  };

  useEffect(() => {
    load();
  }, [activeOwner]);

  const getSpent = (categoryId) => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return transactions
      .filter(
        (t) =>
          t.category_id === categoryId &&
          t.type === "expense" &&
          t.date.startsWith(month),
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleSave = async () => {
    if (!form.category_id || !form.amount) return;
    const data = { ...form };
    if (activeOwner) data.owner_id = activeOwner.id;
    await axios.post("/api/limits", data, { headers: headers() });
    setShowModal(false);
    setForm({ category_id: "", amount: "", period: "monthly" });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити ліміт?")) return;
    await axios.delete(`/api/limits/${id}`, { headers: headers() });
    load();
  };

  const fmt = (n) => Number(n).toLocaleString("uk-UA") + " ₴";

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          {activeOwner ? `Ліміти — ${activeOwner.name}` : "Ліміти"}
        </h2>
        <button onClick={() => setShowModal(true)} style={styles.addBtn}>
          + Додати
        </button>
      </div>

      {limits.length === 0 ? (
        <div style={styles.empty}>Лімітів ще немає. Встановіть перший!</div>
      ) : (
        <div style={styles.list}>
          {limits.map((l) => {
            const spent = getSpent(l.category_id);
            const percent = Math.min((spent / l.amount) * 100, 100);
            const isOver = spent > l.amount;

            return (
              <div key={l.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <span style={styles.categoryName}>{l.category_name}</span>
                    <span style={styles.period}>
                      {l.period === "monthly" ? " · Місяць" : " · Тиждень"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(l.id)}
                    style={styles.deleteBtn}
                  >
                    🗑️
                  </button>
                </div>

                <div style={styles.amounts}>
                  <span
                    style={{
                      color: isOver ? "#e17055" : "#2d3436",
                      fontWeight: "600",
                    }}
                  >
                    {fmt(spent)}
                  </span>
                  <span style={styles.limitAmount}>з {fmt(l.amount)}</span>
                </div>

                <div style={styles.progressBg}>
                  <div
                    style={{
                      ...styles.progressBar,
                      width: `${percent}%`,
                      backgroundColor: isOver
                        ? "#e17055"
                        : percent > 75
                          ? "#fdcb6e"
                          : "#00b894",
                    }}
                  />
                </div>

                <div style={styles.progressLabel}>
                  {isOver ? (
                    <span style={{ color: "#e17055" }}>
                      ⚠️ Перевищено на {fmt(spent - l.amount)}
                    </span>
                  ) : (
                    <span style={{ color: "#636e72" }}>
                      Залишок: {fmt(l.amount - spent)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Новий ліміт</h3>

            <label style={styles.label}>Категорія витрат</label>
            <select
              style={styles.input}
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
            >
              <option value="">Оберіть категорію</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <label style={styles.label}>Сума ліміту (₴)</label>
            <input
              style={styles.input}
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            <label style={styles.label}>Період</label>
            <select
              style={styles.input}
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
            >
              <option value="monthly">Місяць</option>
              <option value="weekly">Тиждень</option>
            </select>

            <div style={styles.modalButtons}>
              <button
                onClick={() => setShowModal(false)}
                style={styles.cancelBtn}
              >
                Скасувати
              </button>
              <button onClick={handleSave} style={styles.saveBtn}>
                Зберегти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "32px", maxWidth: "900px", margin: "0 auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: { fontSize: "22px", fontWeight: "700", color: "#2d3436" },
  addBtn: {
    padding: "10px 20px",
    backgroundColor: "#6c5ce7",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  list: { display: "flex", flexDirection: "column", gap: "16px" },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  categoryName: { fontSize: "16px", fontWeight: "600", color: "#2d3436" },
  period: { fontSize: "13px", color: "#b2bec3" },
  amounts: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    marginBottom: "10px",
  },
  limitAmount: { fontSize: "13px", color: "#b2bec3" },
  progressBg: {
    height: "8px",
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "8px",
  },
  progressBar: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  progressLabel: { fontSize: "13px" },
  deleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  empty: {
    textAlign: "center",
    color: "#b2bec3",
    padding: "80px 0",
    fontSize: "15px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "32px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#2d3436",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#636e72",
    marginBottom: "6px",
    marginTop: "14px",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #dfe6e9",
    fontSize: "14px",
    outline: "none",
  },
  modalButtons: { display: "flex", gap: "10px", marginTop: "24px" },
  cancelBtn: {
    flex: 1,
    padding: "10px",
    border: "1px solid #dfe6e9",
    borderRadius: "8px",
    backgroundColor: "#fff",
    fontSize: "14px",
    cursor: "pointer",
  },
  saveBtn: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#6c5ce7",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Limits;
