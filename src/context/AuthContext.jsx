// ─────────────────────────────────────────────
//  context/AuthContext.jsx
// ─────────────────────────────────────────────
//  Maneja el estado de sesión global.
//  El JWT vive en una cookie httpOnly seteada
//  por el servidor — el frontend nunca lo lee.
//  Al iniciar la app se llama a /api/auth/me
//  para saber si hay sesión activa.
// ─────────────────────────────────────────────

import { createContext, useContext, useState, useEffect } from "react";
import api from "../hooks/service/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [Error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // true mientras verifica sesión

  // ── Verifica sesión al montar la app ──────────────────────────────────────
  // El navegador envía automáticamente la cookie httpOnly en esta petición.
  // Si el servidor responde 200 → hay sesión activa.
  // Si responde 401 → no hay sesión (o expiró).
  const checkSession = async () => {
    try {
      const data = await api.get("/User/auth/me");
      console.log("Datos Result:", data);
      if (data.isSuccess) {
        setUser(data.value);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("Fallo", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  // ── login ─────────────────────────────────────────────────────────────────
  // Llama al endpoint de login. El servidor setea la cookie httpOnly
  // con el JWT y devuelve los datos del usuario.
  const login = async ({ email, password }) => {
    const data = await api.post("/User/login", {
      email,
      password,
    });

    if (!data.isSuccess) {
      setError(data.error);
    }

    setUser(data.value.user);
    return data;
  };

  // ── logout ────────────────────────────────────────────────────────────────
  // El servidor elimina / expira la cookie httpOnly.
  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        Error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook de consumo ───────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>.");
  return ctx;
}
