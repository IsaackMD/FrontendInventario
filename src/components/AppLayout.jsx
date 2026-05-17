// ─────────────────────────────────────────────
//  components/AppLayout.jsx
// ─────────────────────────────────────────────
//  Layout shell para todas las rutas protegidas.
//  Incluye Sidebar fijo + área de contenido.
//  Se usa como `element` en ProtectedRoute,
//  reemplazando el <Outlet /> directo.
// ─────────────────────────────────────────────

import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import styles from "./AppLayout.style";
// ── Nav items ─────────────────────────────────────────────────────────────────
//  Agrega o quita rutas aquí. `roles` opcional: solo aparece si el usuario
//  tiene ese rol (deja el array vacío para que sea visible por todos).

const NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/dashboard",
    roles: [],
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: "Productos",
    to: "/products",
    roles: [],
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    label: "Categorías",
    to: "/categories",
    roles: [],
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    label: "Reportes",
    to: "/reports",
    roles: [],
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6"  y1="20" x2="6"  y2="14"/>
      </svg>
    ),
  },
  {
    label: "Usuarios",
    to: "/users",
    roles: ["admin"],           // solo visible para admins
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const visibleItems = NAV_ITEMS.filter(
    (item) => item.roles.length === 0 || item.roles.includes(user?.role)
  );

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside style={{
      ...styles.sidebar,
      width: collapsed ? "64px" : "var(--sidebar-w, 240px)",
    }}>

      {/* Logo */}
      <div style={styles.sidebarLogo}>
        <div style={styles.logoIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M7 8h2v5H7zM11 6h2v7h-2zM15 9h2v4h-2z"/>
            <path d="M8 21h8M12 17v4"/>
          </svg>
        </div>
        {!collapsed && (
          <span style={styles.logoText}>
            Stock<span style={{ color: "var(--accent, #4ade80)" }}>IQ</span>
          </span>
        )}
        <button style={styles.collapseBtn} onClick={onToggle} aria-label="Toggle sidebar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {collapsed
              ? <path d="M9 18l6-6-6-6"/>
              : <path d="M15 18l-6-6 6-6"/>}
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Nav */}
      <nav style={styles.nav}>
        {!collapsed && (
          <span style={styles.navSection}>Navegación</span>
        )}
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
              justifyContent: collapsed ? "center" : "flex-start",
              padding: collapsed ? "10px" : "9px 12px",
            })}
            title={collapsed ? item.label : undefined}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            {!collapsed && <span style={styles.navLabel}>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Divider */}
      <div style={styles.divider} />

      {/* User + logout */}
      <div style={{
        ...styles.userArea,
        padding: collapsed ? "14px 10px" : "14px 16px",
        justifyContent: collapsed ? "center" : "space-between",
      }}>
        {!collapsed && (
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={styles.userName}>{user?.name ?? "Usuario"}</p>
              <p style={styles.userRole}>{user?.role ?? "—"}</p>
            </div>
          </div>
        )}
        <button
          style={styles.logoutBtn}
          onClick={handleLogout}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>

    </aside>
  );
}

// ── AppLayout ─────────────────────────────────────────────────────────────────

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarW = collapsed ? 64 : 240;

  return (
    <div style={styles.shell}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      {/* Main content */}
      <main style={{ ...styles.main, marginLeft: sidebarW }}>
        <div style={styles.pageBody}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

