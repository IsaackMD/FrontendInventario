// ─────────────────────────────────────────────
//  router/index.jsx
// ─────────────────────────────────────────────
//  Configuración central de React Router v7.
//  Usa createBrowserRouter (API moderna con
//  soporte a loaders, actions y error boundaries).
// ─────────────────────────────────────────────

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "../LoginPage/LoginPage";
import ProtectedRoute from "./Protectedroute";
import DashboardPage from "../Dashboard/DashboardPage";
import ProductsPage from "../Productos/ProductoPage";

// Páginas — ajusta las rutas de importación a tu estructura

// ── Árbol de rutas ────────────────────────────────────────────────────────────

const router = createBrowserRouter([
  // Rutas públicas
  {
    path: "/login",
    element: <LoginPage />,
  },
//   {
//     path: "/unauthorized",
//     element: <UnauthorizedPage />,
//   },

  // ── Rutas protegidas (solo autenticados) ────────────────────────────────
  {
    element: <ProtectedRoute />,             // guard: solo sesión activa
    children: [
      { path: "/dashboard",           element: <DashboardPage /> },
      { path: "/products",   element: <ProductsPage /> },
    //   { path: "/categories", element: <CategoriesPage /> },
    //   { path: "/reports",    element: <ReportsPage /> },
      {}
    ],
  },

  // ── Rutas protegidas por rol ────────────────────────────────────────────
  {
    element: <ProtectedRoute requiredRole="admin" />,   // guard: rol admin
    children: [
    //   { path: "/users", element: <UsersPage /> },
      {}
    ],
  },

  // 404
  {
    path: "*",
    element: <LoginPage />,
  },
]);

// ── Exporta el provider del router ───────────────────────────────────────────
export default function AppRouter() {
  return <RouterProvider router={router} />;
}