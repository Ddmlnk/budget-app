import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useBudget } from "../context/BudgetContext";

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function Members() {
  const [members, setMembers] = useState([]);
  const [access, setAccess] = useState([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("my");
  const { activeOwner, setActiveOwner } = useBudget();
  const navigate = useNavigate();

  const load = async () => {
    const [m, a] = await Promise.all([
      axios.get("/api/share/members", { headers: headers() }),
      axios.get("/api/share/access", { headers: headers() }),
    ]);
    setMembers(m.data);
    setAccess(a.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleInvite = async () => {
    if (!email.trim()) return;
    setError("");
    setMessage("");
    try {
      const res = await axios.post(
        "/api/share/invite",
        { email },
        { headers: headers() },
      );
      setMessage(`✅ ${res.data.name} додано до спільного бюджету!`);
      setEmail("");
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Помилка");
    }
  };

  const handleRemove = async (id) => {
    if (!confirm("Видалити учасника?")) return;
    await axios.delete(`/api/share/members/${id}`, { headers: headers() });
    if (activeOwner?.id === id) setActiveOwner(null);
    load();
  };

  const handleViewBudget = (owner) => {
    setActiveOwner(owner);
    navigate("/dashboard");
  };

  const handleMyBudget = () => {
    setActiveOwner(null);
    navigate("/dashboard");
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Спільний бюджет</h2>

      {activeOwner && (
        <div style={styles.activeBanner}>
          👁️ Ви переглядаєте бюджет: <b>{activeOwner.name}</b>
          <button onClick={handleMyBudget} style={styles.myBudgetBtn}>
            Повернутись до свого
          </button>
        </div>
      )}

      <div style={styles.inviteBox}>
        <h3 style={styles.sectionTitle}>Запросити учасника</h3>
        <p style={styles.hint}>
          Введіть email користувача який вже зареєстрований в системі
        </p>

        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.inviteRow}>
          <input
            style={styles.input}
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInvite()}
          />
          <button onClick={handleInvite} style={styles.inviteBtn}>
            Запросити
          </button>
        </div>
      </div>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab("my")}
          style={{
            ...styles.tab,
            ...(activeTab === "my" ? styles.tabActive : {}),
          }}
        >
          Мої учасники ({members.length})
        </button>
        <button
          onClick={() => setActiveTab("access")}
          style={{
            ...styles.tab,
            ...(activeTab === "access" ? styles.tabActive : {}),
          }}
        >
          Маю доступ до ({access.length})
        </button>
      </div>

      {activeTab === "my" && (
        <div style={styles.list}>
          {members.length === 0 ? (
            <div style={styles.empty}>Ви ще нікого не запросили</div>
          ) : (
            members.map((m) => (
              <div key={m.id} style={styles.card}>
                <div style={styles.avatar}>{m.name[0].toUpperCase()}</div>
                <div style={styles.info}>
                  <div style={styles.name}>{m.name}</div>
                  <div style={styles.emailText}>{m.email}</div>
                </div>
                <button
                  onClick={() => handleRemove(m.id)}
                  style={styles.removeBtn}
                >
                  Видалити
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "access" && (
        <div style={styles.list}>
          {access.length === 0 ? (
            <div style={styles.empty}>Вам ще ніхто не дав доступу</div>
          ) : (
            access.map((a) => (
              <div key={a.id} style={styles.card}>
                <div style={{ ...styles.avatar, backgroundColor: "#00b894" }}>
                  {a.name[0].toUpperCase()}
                </div>
                <div style={styles.info}>
                  <div style={styles.name}>{a.name}</div>
                  <div style={styles.emailText}>{a.email}</div>
                </div>
                <button
                  onClick={() => handleViewBudget(a)}
                  style={styles.viewBtn}
                >
                  👁️ Переглянути
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "32px", maxWidth: "800px", margin: "0 auto" },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: "24px",
  },
  activeBanner: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#fff3cd",
    padding: "12px 20px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "14px",
    color: "#856404",
  },
  myBudgetBtn: {
    marginLeft: "auto",
    padding: "6px 14px",
    backgroundColor: "#6c5ce7",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
  },
  inviteBox: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: "8px",
  },
  hint: { fontSize: "13px", color: "#b2bec3", marginBottom: "16px" },
  inviteRow: { display: "flex", gap: "12px" },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #dfe6e9",
    fontSize: "14px",
    outline: "none",
  },
  inviteBtn: {
    padding: "10px 24px",
    backgroundColor: "#6c5ce7",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  success: {
    backgroundColor: "#e8f8f2",
    color: "#00b894",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  error: {
    backgroundColor: "#fff5f5",
    color: "#e17055",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  tabs: { display: "flex", gap: "8px", marginBottom: "16px" },
  tab: {
    padding: "8px 20px",
    borderRadius: "8px",
    border: "1px solid #dfe6e9",
    backgroundColor: "#fff",
    fontSize: "14px",
    cursor: "pointer",
    color: "#636e72",
  },
  tabActive: {
    backgroundColor: "#f0eeff",
    borderColor: "#6c5ce7",
    color: "#6c5ce7",
    fontWeight: "600",
  },
  list: { display: "flex", flexDirection: "column", gap: "12px" },
  card: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    backgroundColor: "#fff",
    padding: "16px 20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#6c5ce7",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "700",
    flexShrink: 0,
  },
  info: { flex: 1 },
  name: { fontSize: "15px", fontWeight: "600", color: "#2d3436" },
  emailText: { fontSize: "13px", color: "#b2bec3" },
  removeBtn: {
    padding: "6px 14px",
    backgroundColor: "#fff0ed",
    color: "#e17055",
    border: "1px solid #e17055",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
  },
  viewBtn: {
    padding: "6px 14px",
    backgroundColor: "#f0eeff",
    color: "#6c5ce7",
    border: "1px solid #6c5ce7",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    color: "#b2bec3",
    padding: "40px 0",
    fontSize: "14px",
  },
  accessBadge: {
    padding: "4px 12px",
    backgroundColor: "#e8f8f2",
    color: "#00b894",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
};

export default Members;
