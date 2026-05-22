import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Register({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) return setError("Паролі не співпадають");
    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      onLogin(res.data.token, res.data.name);
    } catch (err) {
      setError(err.response?.data?.error || "Помилка реєстрації");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Реєстрація</h2>
        <p style={styles.subtitle}>Створіть акаунт для керування бюджетом</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Ім'я</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Введіть ваше ім'я"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Пароль</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Мінімум 6 символів"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Підтвердження паролю</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Повторіть пароль"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Зареєструватися
          </button>
        </form>

        <p style={styles.link}>
          Вже є акаунт?{" "}
          <Link to="/login" style={styles.linkText}>
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f6fa",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "420px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "6px",
    color: "#2d3436",
  },
  subtitle: {
    color: "#636e72",
    marginBottom: "28px",
    fontSize: "14px",
  },
  field: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#2d3436",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #dfe6e9",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#6c5ce7",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    marginTop: "8px",
    marginBottom: "20px",
  },
  error: {
    backgroundColor: "#fff5f5",
    color: "#e17055",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  link: {
    textAlign: "center",
    fontSize: "14px",
    color: "#636e72",
  },
  linkText: {
    color: "#6c5ce7",
    fontWeight: "600",
    textDecoration: "none",
  },
};

export default Register;
