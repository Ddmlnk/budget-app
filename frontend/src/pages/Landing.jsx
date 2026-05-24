import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Навбар */}
      <nav style={styles.nav}>
        <div style={styles.logo}>💰 Budget App</div>
        <div style={styles.navLinks}>
          <button onClick={() => navigate("/login")} style={styles.loginBtn}>
            Увійти
          </button>
          <button
            onClick={() => navigate("/register")}
            style={styles.signupBtn}
          >
            Реєстрація
          </button>
        </div>
      </nav>

      {/* Герой */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Керуй сімейним
            <br />
            бюджетом разом
          </h1>
          <p style={styles.heroSubtitle}>
            Плануй витрати, контролюй доходи та досягай фінансових цілей разом з
            родиною
          </p>
          <div style={styles.heroButtons}>
            <button onClick={() => navigate("/register")} style={styles.ctaBtn}>
              Створити бюджет
            </button>
            <button
              onClick={() => navigate("/login")}
              style={styles.secondaryBtn}
            >
              Увійти
            </button>
          </div>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.mockup}>
            <div style={styles.mockupHeader}>
              <span style={styles.dot} />
              <span style={{ ...styles.dot, backgroundColor: "#fdcb6e" }} />
              <span style={{ ...styles.dot, backgroundColor: "#00b894" }} />
            </div>
            <div style={styles.mockupCard}>
              <p style={styles.mockupLabel}>Баланс</p>
              <p style={styles.mockupValue}>12,500 ₴</p>
            </div>
            <div style={styles.mockupRow}>
              <div
                style={{
                  ...styles.mockupSmall,
                  borderTop: "3px solid #00b894",
                }}
              >
                <p style={styles.mockupSmallLabel}>Доходи</p>
                <p style={{ ...styles.mockupSmallValue, color: "#00b894" }}>
                  25,000 ₴
                </p>
              </div>
              <div
                style={{
                  ...styles.mockupSmall,
                  borderTop: "3px solid #e17055",
                }}
              >
                <p style={styles.mockupSmallLabel}>Витрати</p>
                <p style={{ ...styles.mockupSmallValue, color: "#e17055" }}>
                  12,500 ₴
                </p>
              </div>
            </div>
            <div style={styles.mockupBar}>
              <div style={styles.mockupBarFill} />
            </div>
            <p style={styles.mockupBarLabel}>
              Ліміт на продукти: 3,000 / 5,000 ₴
            </p>
          </div>
        </div>
      </section>

      {/* Можливості */}
      <section style={styles.features}>
        <h2 style={styles.featuresTitle}>
          Все що потрібно для фінансового контролю
        </h2>
        <div style={styles.featuresGrid}>
          {[
            {
              icon: "📊",
              title: "Дашборд",
              desc: "Графіки доходів і витрат по місяцях, кругова діаграма по категоріях",
            },
            {
              icon: "💳",
              title: "Транзакції",
              desc: "Додавай доходи та витрати, фільтруй по даті, типу та категорії",
            },
            {
              icon: "🗂️",
              title: "Категорії",
              desc: "Власні категорії для зручної класифікації витрат і доходів",
            },
            {
              icon: "🎯",
              title: "Ліміти",
              desc: "Встановлюй бюджетні ліміти і відстежуй прогрес у реальному часі",
            },
            {
              icon: "👥",
              title: "Спільний бюджет",
              desc: "Запрошуй членів родини і ведіть бюджет разом",
            },
            {
              icon: "🔒",
              title: "Безпека",
              desc: "Захищений доступ з JWT авторизацією і шифруванням паролів",
            },
          ].map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Почни контролювати бюджет сьогодні</h2>
        <p style={styles.ctaSubtitle}>
          Безкоштовно. Без реклами. Для всієї родини.
        </p>
        <button
          onClick={() => navigate("/register")}
          style={styles.ctaBtnLarge}
        >
          Створити акаунт безкоштовно
        </button>
      </section>

      {/* Футер */}
      <footer style={styles.footer}>
        <p>© 2026 БюджетАпп. Розроблено як дипломний проєкт.</p>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f6fa",
    fontFamily: "'Segoe UI', sans-serif",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 48px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: { fontSize: "20px", fontWeight: "700", color: "#6c5ce7" },
  navLinks: { display: "flex", gap: "12px" },
  loginBtn: {
    padding: "8px 20px",
    border: "1px solid #6c5ce7",
    borderRadius: "8px",
    backgroundColor: "transparent",
    color: "#6c5ce7",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  signupBtn: {
    padding: "8px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#6c5ce7",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  hero: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "80px 48px",
    maxWidth: "1200px",
    margin: "0 auto",
    gap: "48px",
  },
  heroContent: { flex: 1 },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "800",
    color: "#2d3436",
    lineHeight: 1.2,
    marginBottom: "20px",
  },
  heroSubtitle: {
    fontSize: "18px",
    color: "#636e72",
    marginBottom: "32px",
    lineHeight: 1.6,
    maxWidth: "480px",
  },
  heroButtons: { display: "flex", gap: "16px" },
  ctaBtn: {
    padding: "14px 32px",
    backgroundColor: "#6c5ce7",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "14px 32px",
    backgroundColor: "transparent",
    color: "#6c5ce7",
    border: "2px solid #6c5ce7",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },
  heroImage: { flex: 1, display: "flex", justifyContent: "center" },
  mockup: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 8px 32px rgba(108,92,231,0.15)",
    width: "320px",
  },
  mockupHeader: { display: "flex", gap: "6px", marginBottom: "20px" },
  dot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#e17055",
  },
  mockupCard: {
    backgroundColor: "#f0eeff",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
    textAlign: "center",
  },
  mockupLabel: { fontSize: "13px", color: "#6c5ce7", marginBottom: "8px" },
  mockupValue: { fontSize: "32px", fontWeight: "800", color: "#6c5ce7" },
  mockupRow: { display: "flex", gap: "12px", marginBottom: "16px" },
  mockupSmall: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    borderRadius: "10px",
    padding: "14px",
  },
  mockupSmallLabel: { fontSize: "12px", color: "#636e72", marginBottom: "6px" },
  mockupSmallValue: { fontSize: "18px", fontWeight: "700" },
  mockupBar: {
    height: "8px",
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "8px",
  },
  mockupBarFill: {
    width: "60%",
    height: "100%",
    backgroundColor: "#6c5ce7",
    borderRadius: "4px",
  },
  mockupBarLabel: { fontSize: "12px", color: "#636e72" },
  features: { padding: "80px 48px", maxWidth: "1200px", margin: "0 auto" },
  featuresTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#2d3436",
    textAlign: "center",
    marginBottom: "48px",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    textAlign: "center",
  },
  featureIcon: { fontSize: "40px", marginBottom: "16px" },
  featureTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: "12px",
  },
  featureDesc: { fontSize: "14px", color: "#636e72", lineHeight: 1.6 },
  cta: {
    backgroundColor: "#6c5ce7",
    padding: "80px 48px",
    textAlign: "center",
  },
  ctaTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "16px",
  },
  ctaSubtitle: {
    fontSize: "18px",
    color: "rgba(255,255,255,0.8)",
    marginBottom: "32px",
  },
  ctaBtnLarge: {
    padding: "16px 48px",
    backgroundColor: "#fff",
    color: "#6c5ce7",
    border: "none",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
  },
  footer: {
    backgroundColor: "#2d3436",
    padding: "24px 48px",
    textAlign: "center",
    color: "#b2bec3",
    fontSize: "14px",
  },
};

export default Landing;
