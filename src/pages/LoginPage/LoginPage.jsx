// ─────────────────────────────────────────────
//  LoginPage.jsx  –  UI del login de inventario
// ─────────────────────────────────────────────

import { useState } from "react";
import useLogin from "../../hooks/useLogin";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
// ── Icono ojo (mostrar/ocultar contraseña) ────────────────────────────────────
const EyeIcon = ({ open }) =>
  open ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

// ── Componente principal ──────────────────────────────────────────────────────
export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const navegate = useNavigate();
  const { fields, errors, apiError, loading, handleChange, handleSubmit } =
    useLogin({
      onSuccess: (data) => {
        
       navegate('/dashboard');
      },
    });

  return (
    <div className="flex justify-center">
      <div className="bg-grid" />
      <div className="bg-glow" />

      <div className="card">
        {/* Logo */}
        <div className="logo-row">
          <div className="logo-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
              <path d="M7 8h2v5H7zM11 6h2v7h-2zM15 9h2v4h-2z" />
            </svg>
          </div>
          <span className="logo-name">
            Stock<span>IQ</span>
          </span>
        </div>
        <p className="tagline">Sistema de gestión de inventario</p>

        <h1>Iniciar sesión</h1>
        <p className="subtitle">Accede a tu panel de control.</p>

        {/* Error de API */}
        {apiError && (
          <div className="api-error">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="field">
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-wrap">
              <input
                id="email"
                type="email"
                name="email"
                placeholder="usuario@empresa.com"
                value={fields.email}
                onChange={handleChange}
                className={errors.email ? "has-error" : ""}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="error-msg">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrap">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={fields.password}
                onChange={handleChange}
                className={errors.password ? "has-error" : ""}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPass((v) => !v)}
                aria-label={
                  showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                <EyeIcon open={showPass} />
              </button>
            </div>
            {errors.password && (
              <p className="error-msg">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Verificando…
              </>
            ) : (
              "Ingresar al sistema"
            )}
          </button>
        </form>

        <div className="card-footer">
          <div className="badge">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Conexión segura
          </div>
          <p>Acceso restringido · Solo personal autorizado</p>
        </div>
      </div>
    </div>
  );
}
