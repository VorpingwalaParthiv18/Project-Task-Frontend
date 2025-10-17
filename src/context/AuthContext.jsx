import { useState, useEffect } from "react";
import { AuthContext } from "./CreateContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user info from backend; HttpOnly cookie sent automatically
    fetch(`${import.meta.env.VITE_PORT
}/auth/me`, { credentials: "include" ,method: "GET"})
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.email) setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    // Call backend login API, which sets HttpOnly cookie
    const res = await fetch(`${import.meta.env.VITE_PORT
}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
    }
  };

  const logout = async () => {
    // Call backend logout API, which clears cookie
    await fetch(`${import.meta.env.VITE_PORT
}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
