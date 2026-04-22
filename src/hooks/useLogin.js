// ─────────────────────────────────────────────
//  useLogin.js  –  Hook personalizado de login
// ─────────────────────────────────────────────
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// ── 1. Validaciones puras (sin efectos secundarios) ──────────────────────────
export const validate = ({ email, password }) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = "El correo es obligatorio.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Ingresa un correo válido.";
  }

  if (!password) {
    errors.password = "La contraseña es obligatoria.";
  } else if (password.length < 6) {
    errors.password = "Mínimo 6 caracteres.";
  }

  return errors;
};


// ── 3. Hook principal ─────────────────────────────────────────────────────────
const useLogin = ({ onSuccess } = {}) => {
  const [fields, setFields] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Limpia el error del campo al escribir
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación local
    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const data = await login(fields);
      onSuccess?.(data);
    } catch (err) {
      setApiError(err.data.error);
    } finally {
      setLoading(false);
    }
  };

  return { fields, errors, apiError, loading, handleChange, handleSubmit };
};

export default useLogin;
