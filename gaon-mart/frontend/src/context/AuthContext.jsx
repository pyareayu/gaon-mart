import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("gaonmart_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me", { auth: true })
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem("gaonmart_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(payload) {
    const data = await api.post("/auth/login", payload);
    localStorage.setItem("gaonmart_token", data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    const data = await api.post("/auth/register", payload);
    localStorage.setItem("gaonmart_token", data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("gaonmart_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
