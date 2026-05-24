import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>💰 BudgetApp</div>

      <div style={styles.links}>
        <Link
          to="/dashboard"
          style={{
            ...styles.link,
            ...(isActive("/dashboard") ? styles.active : {}),
          }}
        >
          Дашборд
        </Link>
        <Link
          to="/transactions"
          style={{
            ...styles.link,
            ...(isActive("/transactions") ? styles.active : {}),
          }}
        >
          Транзакції
        </Link>
        <Link
          to="/categories"
          style={{
            ...styles.link,
            ...(isActive("/categories") ? styles.active : {}),
          }}
        >
          Категорії
        </Link>
        <Link
          to="/limits"
          style={{
            ...styles.link,
            ...(isActive("/limits") ? styles.active : {}),
          }}
        >
          Ліміти
        </Link>
        <Link
          to="/members"
          style={{
            ...styles.link,
            ...(isActive("/members") ? styles.active : {}),
          }}
        >
          Учасники
        </Link>
      </div>

      <div style={styles.user}>
        <span style={styles.userName}>👤 {name}</span>
        <button onClick={handleLogout} style={styles.logout}>
          Вийти
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    height: "60px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#6c5ce7",
  },
  links: {
    display: "flex",
    gap: "8px",
  },
  link: {
    padding: "6px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    color: "#636e72",
  },
  active: {
    backgroundColor: "#f0eeff",
    color: "#6c5ce7",
  },
  user: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userName: {
    fontSize: "14px",
    color: "#2d3436",
    fontWeight: "500",
  },
  logout: {
    padding: "6px 14px",
    backgroundColor: "transparent",
    border: "1px solid #dfe6e9",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#636e72",
    cursor: "pointer",
  },
};

export default Navbar;
