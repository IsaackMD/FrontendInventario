// ─────────────────────────────────────────────
//  context/AuthContext.jsx
// ─────────────────────────────────────────────
//  Maneja el estado de sesión global.
//  El JWT vive en una cookie httpOnly seteada
//  por el servidor — el frontend nunca lo lee.
//  Al iniciar la app se llama a /api/auth/me
//  para saber si hay sesión activa.
// ─────────────────────────────────────────────

import { createContext, useState, useEffect } from "react";
import api from "../hooks/service/api";

const AuthContext = createContext(null);

function resolveAuthUser(data) {
  return data?.value ?? data?.user ?? data?.data ?? null;
}

function resolveAuthSuccess(data) {
  if (typeof data?.isSuccess === "boolean") return data.isSuccess;
  if (typeof data?.success === "boolean") return data.success;
  return Boolean(resolveAuthUser(data));
}

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
      if (resolveAuthSuccess(data)) {
        setUser(resolveAuthUser(data));
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

    if (!resolveAuthSuccess(data)) {
      setError(data?.error ?? data?.message ?? "No fue posible iniciar sesión.");
      setUser(null);
      return data;
    }

    setError(null);
    setUser(resolveAuthUser(data));
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
export { AuthContext };
