import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Limits from "./pages/Limits";
import Members from "./pages/Members";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (newToken, name) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("name", name);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setToken(null);
  };

  return (
    <>
      {token && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <Landing />}
        />
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={
            !token ? (
              <Register onLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/transactions"
          element={token ? <Transactions /> : <Navigate to="/login" />}
        />
        <Route
          path="/categories"
          element={token ? <Categories /> : <Navigate to="/login" />}
        />
        <Route
          path="/limits"
          element={token ? <Limits /> : <Navigate to="/login" />}
        />
        <Route
          path="/members"
          element={token ? <Members /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;
