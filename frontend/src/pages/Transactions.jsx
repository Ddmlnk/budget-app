import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useBudget } from "../context/BudgetContext";

const token = () => localStorage.getItem("token");
const headers = () => ({ Authorization: `Bearer ${token()}` });

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    type: "expense",
    category_id: "",
    amount: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const { activeOwner } = useBudget();

  const load = async () => {
    const ownerParam = activeOwner ? `?owner_id=${activeOwner.id}` : "";
    const [t, c] = await Promise.all([
      axios.get(`/api/transactions${ownerParam}`, { headers: headers() }),
      axios.get(`/api/categories${ownerParam}`, { headers: headers() }),
    ]);
    setTransactions(t.data);
    setCategories(c.data);
  };

  useEffect(() => {
    load();
  }, [activeOwner]);

  const filtered = transactions.filter((t) => {
    if (filterType !== "all" && t.type !== filterType) return false;
    if (filterCategory && String(t.category_id) !== filterCategory)
      return false;
    if (filterFrom && t.date < filterFrom) return false;
    if (filterTo && t.date > filterTo) return false;
    return true;
  });

  const resetFilters = () => {
    setFilterType("all");
    setFilterCategory("");
    setFilterFrom("");
    setFilterTo("");
  };

  const filteredCategories = categories.filter((c) => c.type === form.type);

  const openAdd = () => {
    setEditing(null);
    setForm({
      type: "expense",
      category_id: "",
      amount: "",
      description: "",
      date: new Date().toISOString().slice(0, 10),
    });
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({
      type: t.type,
      category_id: t.category_id,
      amount: t.amount,
      description: t.description || "",
      date: t.date,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.amount || !form.date) return;
    const data = { ...form };
    if (activeOwner) data.owner_id = activeOwner.id;

    if (editing) {
      await axios.put(`/api/transactions/${editing.id}`, data, {
        headers: headers(),
      });
    } else {
      await axios.post("/api/transactions", data, { headers: headers() });
    }
    setShowModal(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити транзакцію?")) return;
    await axios.delete(`/api/transactions/${id}`, { headers: headers() });
    load();
  };

  const fmt = (n) => Number(n).toLocaleString("uk-UA") + " ₴";

  const totalIncome = filtered
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          {activeOwner ? `Транзакції — ${activeOwner.name}` : "Транзакції"}
        </h2>
        <button onClick={openAdd} style={styles.addBtn}>
          + Додати
        </button>
      </div>

      {/* Фільтри */}
      <div style={styles.filters}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Тип</label>
          <select
            style={styles.filterInput}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Всі</option>
            <option value="income">Доходи</option>
            <option value="expense">Витрати</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Категорія</label>
          <select
            style={styles.filterInput}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Всі</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Від</label>
          <input
            style={styles.filterInput}
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>До</label>
          <input
            style={styles.filterInput}
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
          />
        </div>

        <button onClick={resetFilters} style={styles.resetBtn}>
          ✕ Скинути
        </button>
      </div>

      {/* Підсумки */}
      <div style={styles.summary}>
        <span style={styles.summaryItem}>
          Знайдено: <b>{filtered.length}</b>
        </span>
        <span style={{ ...styles.summaryItem, color: "#00b894" }}>
          Доходи: <b>{fmt(totalIncome)}</b>
        </span>
        <span style={{ ...styles.summaryItem, color: "#e17055" }}>
          Витрати: <b>{fmt(totalExpense)}</b>
        </span>
        <span
          style={{
            ...styles.summaryItem,
            color: totalIncome - totalExpense >= 0 ? "#00b894" : "#e17055",
          }}
        >
          Різниця: <b>{fmt(totalIncome - totalExpense)}</b>
        </span>
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}>Транзакцій не знайдено</div>
      ) : (
        <div style={styles.tableBox}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Тип</th>
                <th style={styles.th}>Категорія</th>
                <th style={styles.th}>Опис</th>
                <th style={styles.th}>Дата</th>
                <th style={styles.th}>Сума</th>
                <th style={styles.th}>Дії</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor:
                          t.type === "income" ? "#e8f8f2" : "#fff0ed",
                        color: t.type === "income" ? "#00b894" : "#e17055",
                      }}
                    >
                      {t.type === "income" ? "Дохід" : "Витрата"}
                    </span>
                  </td>
                  <td style={styles.td}>{t.category_name || "—"}</td>
                  <td style={styles.td}>{t.description || "—"}</td>
                  <td style={styles.td}>{t.date}</td>
                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "600",
                      color: t.type === "income" ? "#00b894" : "#e17055",
                    }}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {fmt(t.amount)}
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => openEdit(t)} style={styles.editBtn}>
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      style={styles.deleteBtn}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>
              {editing ? "Редагувати" : "Нова транзакція"}
            </h3>

            <label style={styles.label}>Тип</label>
            <div style={styles.typeRow}>
              <button
                onClick={() =>
                  setForm({ ...form, type: "expense", category_id: "" })
                }
                style={{
                  ...styles.typeBtn,
                  ...(form.type === "expense" ? styles.typeBtnExpense : {}),
                }}
              >
                Витрата
              </button>
              <button
                onClick={() =>
                  setForm({ ...form, type: "income", category_id: "" })
                }
                style={{
                  ...styles.typeBtn,
                  ...(form.type === "income" ? styles.typeBtnIncome : {}),
                }}
              >
                Дохід
              </button>
            </div>

            <label style={styles.label}>Категорія</label>
            <select
              style={styles.input}
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
            >
              <option value="">Без категорії</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <label style={styles.label}>Сума (₴)</label>
            <input
              style={styles.input}
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            <label style={styles.label}>Опис</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Необов'язково"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <label style={styles.label}>Дата</label>
            <input
              style={styles.input}
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

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
  page: { padding: "32px", maxWidth: "1100px", margin: "0 auto" },
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
  filters: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-end",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  filterGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  filterLabel: { fontSize: "12px", fontWeight: "500", color: "#636e72" },
  filterInput: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #dfe6e9",
    fontSize: "13px",
    outline: "none",
    minWidth: "130px",
  },
  resetBtn: {
    padding: "8px 16px",
    backgroundColor: "#f5f6fa",
    border: "1px solid #dfe6e9",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
    color: "#636e72",
    alignSelf: "flex-end",
  },
  summary: {
    display: "flex",
    gap: "24px",
    padding: "14px 20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  summaryItem: { fontSize: "14px", color: "#2d3436" },
  tableBox: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: "13px",
    color: "#636e72",
    borderBottom: "1px solid #f0f0f0",
    backgroundColor: "#fafafa",
  },
  td: {
    padding: "14px 16px",
    fontSize: "14px",
    color: "#2d3436",
    borderBottom: "1px solid #f5f5f5",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  editBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    marginRight: "8px",
    fontSize: "16px",
  },
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
    maxWidth: "440px",
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
  typeRow: { display: "flex", gap: "8px" },
  typeBtn: {
    flex: 1,
    padding: "8px",
    border: "1px solid #dfe6e9",
    borderRadius: "8px",
    backgroundColor: "#f5f6fa",
    fontSize: "14px",
    cursor: "pointer",
  },
  typeBtnExpense: {
    backgroundColor: "#fff0ed",
    borderColor: "#e17055",
    color: "#e17055",
    fontWeight: "600",
  },
  typeBtnIncome: {
    backgroundColor: "#e8f8f2",
    borderColor: "#00b894",
    color: "#00b894",
    fontWeight: "600",
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

export default Transactions;
