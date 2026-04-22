import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./pages/router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* AuthProvider siempre por fuera del router */}
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>,
);
