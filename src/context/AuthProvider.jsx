import { useCallback, useEffect, useState } from "react";
import { api, TOKEN_KEY } from "../api/client";
import { AuthContext } from "./auth";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token); // true while restoring a saved session

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token || user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    api
      .me()
      .then((u) => !cancelled && setUser(u))
      .catch(() => !cancelled && logout())
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [token, user, logout]);

  useEffect(() => {
    window.addEventListener("auth:expired", logout);
    return () => window.removeEventListener("auth:expired", logout);
  }, [logout]);

  async function login(username, password) {
    const { token: t } = await api.login(username, password);
    localStorage.setItem(TOKEN_KEY, t);
    try {
      setUser(await api.me());
      setToken(t);
    } catch (err) {
      localStorage.removeItem(TOKEN_KEY);
      throw err;
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  );
}