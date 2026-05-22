import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CategoryPage from "../Categorias/CategoryPage";
import DashboardPage from "../Dashboard/DashboardPage";
import LoginPage from "../LoginPage/LoginPage";
import ProductsPage from "../Productos/ProductoPage";
import ProtectedRoute from "./Protectedroute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/categories", element: <CategoryPage /> },
    ],
  },
  {
    path: "*",
    element: <LoginPage />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
