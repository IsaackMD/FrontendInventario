// ─────────────────────────────────────────────
//  useLogin.js  –  Hook personalizado de login
// ─────────────────────────────────────────────
import { useState } from "react";
import api from "./service/api";

// ── 3. Hook principal ─────────────────────────────────────────────────────────
const useDashboard = () => {
  const [Resumen, SetResumen] = useState({});
  const [Movimientos, SetMovimientos] = useState({});
  const [Alerta, SetAlerta] = useState({});
  const [loading, setLoading] = useState(false);
  const ResumenInventario = async () => {
    const { isSuccess, error, value } = await api.get("/ResumenDashboard");
    if (!isSuccess) return console.log(error);
    SetResumen(value);
    return value;
  };
  const getMovimientos = async () => {
    const { isSuccess, error, value } = await api.get("/Stock/LastMovements");
    if (!isSuccess) return console.log(error);
    SetMovimientos(value);
    return value;
  };

  const getAlertas = async () => {
    const { isSuccess, error, value } = await api.get(
      "/ResumenDashboard/low-products",
    );
    if (!isSuccess) return console.log(error);
    SetAlerta(value);
    return value;
  };

  // 🔥 Aquí vive el Promise.all
  const loadDashboard = async () => {
    try {
      setLoading(true);

      await Promise.all([ResumenInventario(), getMovimientos(), getAlertas()]);
    } catch (err) {
      console.error("Error cargando dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  return { loadDashboard, Resumen, Movimientos, Alerta, loading };
};

export default useDashboard;
