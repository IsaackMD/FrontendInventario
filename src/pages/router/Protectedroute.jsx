// ─────────────────────────────────────────────
//  components/ProtectedRoute.jsx
// ─────────────────────────────────────────────
//  Guard de rutas para React Router v7.
//  - Sin sesión      → redirige a /login
//  - Sin el rol req. → redirige a /unauthorized
//  - Verificando     → muestra spinner
//  - OK              → renderiza la ruta hija
// ─────────────────────────────────────────────

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "../../components/AppLayout";

// Jerarquía de roles: número mayor = más permisos
const ROLE_LEVEL = {
  viewer: 1,
  editor: 2,
  admin: 3,
};

/**
 * @param {object}  props
 * @param {string}  [props.requiredRole] - Rol mínimo para acceder ("viewer" | "editor" | "admin").
 *                                         Si se omite, solo requiere estar autenticado.
 */
export default function ProtectedRoute({ requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Mientras se verifica la sesión con el servidor → spinner
  if (loading) {
    return <SessionLoader />;
  }

  // Sin sesión → al login, guardando la ruta que intentaba visitar
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Con rol requerido → verifica jerarquía
  if (requiredRole && user) {
    const userLevel = ROLE_LEVEL[user.role] ?? 0;
    const requiredLevel = ROLE_LEVEL[requiredRole] ?? 0;

    if (userLevel < requiredLevel) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Acceso concedido → renderiza las rutas hijas
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

// ── Spinner de verificación de sesión ─────────────────────────────────────────
function SessionLoader() {
  return (
    <div style={styles.overlay}>
      <div style={styles.spinner} />
    </div>
  );
}

const styles = {
  overlay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#0d0f14",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid rgba(74,222,128,.15)",
    borderTop: "3px solid #4ade80",
    borderRadius: "50%",
    animation: "spin .8s linear infinite",
  },
};

// Inyecta el keyframe del spinner (solo se agrega una vez al documento)
if (!document.getElementById("__protected-route-styles__")) {
  const style = document.createElement("style");
  style.id = "__protected-route-styles__";
  style.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(style);
}
