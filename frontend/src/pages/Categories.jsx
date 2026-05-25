import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useBudget } from "../context/BudgetContext";

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", type: "expense" });
  const { activeOwner } = useBudget();

  const load = async () => {
    const ownerParam = activeOwner ? `?owner_id=${activeOwner.id}` : "";
    const res = await axios.get(`/api/categories${ownerParam}`, {
      headers: headers(),
    });
    setCategories(res.data);
  };

  useEffect(() => {
    load();
  }, [activeOwner]);

  const income = categories.filter((c) => c.type === "income");
  const expense = categories.filter((c) => c.type === "expense");

  const handleSave = async () => {
    if (!form.name.trim()) return;
    const data = { ...form };
    if (activeOwner) data.owner_id = activeOwner.id;
    await axios.post("/api/categories", data, { headers: headers() });
    setShowModal(false);
    setForm({ name: "", type: "expense" });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити категорію?")) return;
    await axios.delete(`/api/categories/${id}`, { headers: headers() });
    load();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          {activeOwner ? `Категорії — ${activeOwner.name}` : "Категорії"}
        </h2>
        <button onClick={() => setShowModal(true)} style={styles.addBtn}>
          + Додати
        </button>
      </div>

      <div style={styles.grid}>
        <div style={styles.section}>
          <h3 style={{ ...styles.sectionTitle, color: "#e17055" }}>
            🔴 Витрати
          </h3>
          {expense.length === 0 ? (
            <p style={styles.empty}>Немає категорій</p>
          ) : (
            expense.map((c) => (
              <div key={c.id} style={styles.card}>
                <span style={styles.cardName}>{c.name}</span>
                <button
                  onClick={() => handleDelete(c.id)}
                  style={styles.deleteBtn}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        <div style={styles.section}>
          <h3 style={{ ...styles.sectionTitle, color: "#00b894" }}>
            🟢 Доходи
          </h3>
          {income.length === 0 ? (
            <p style={styles.empty}>Немає категорій</p>
          ) : (
            income.map((c) => (
              <div key={c.id} style={styles.card}>
                <span style={styles.cardName}>{c.name}</span>
                <button
                  onClick={() => handleDelete(c.id)}
                  style={styles.deleteBtn}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Нова категорія</h3>

            <label style={styles.label}>Тип</label>
            <div style={styles.typeRow}>
              <button
                onClick={() => setForm({ ...form, type: "expense" })}
                style={{
                  ...styles.typeBtn,
                  ...(form.type === "expense" ? styles.typeBtnExpense : {}),
                }}
              >
                Витрата
              </button>
              <button
                onClick={() => setForm({ ...form, type: "income" })}
                style={{
                  ...styles.typeBtn,
                  ...(form.type === "income" ? styles.typeBtnIncome : {}),
                }}
              >
                Дохід
              </button>
            </div>

            <label style={styles.label}>Назва</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Наприклад: Продукти"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
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
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" },
  section: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  sectionTitle: { fontSize: "16px", fontWeight: "700", marginBottom: "16px" },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderRadius: "8px",
    backgroundColor: "#f5f6fa",
    marginBottom: "8px",
  },
  cardName: { fontSize: "14px", fontWeight: "500", color: "#2d3436" },
  deleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  empty: {
    color: "#b2bec3",
    fontSize: "14px",
    textAlign: "center",
    padding: "24px 0",
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

export default Categories;
