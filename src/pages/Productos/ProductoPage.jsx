import { useEffect } from "react";
import useDashboard from "../../hooks/useDashboard";
import "./DashboardPage.css";

// ─────────────────────────────────────────────
//  pages/DashboardPage.jsx
// ─────────────────────────────────────────────
//  Reemplaza los datos de ejemplo por tus hooks
//  reales cuando los tengas listos.
//  Estructura basada en dashboard_guia.txt
// ─────────────────────────────────────────────


// ── Icono SVG inline genérico ─────────────────────────────────────────────────

function Icon({ d, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {Array.isArray(d) ? (
        d.map((path, i) => <path key={i} d={path} />)
      ) : (
        <path d={d} />
      )}
    </svg>
  );
}

// ── StockBadge ────────────────────────────────────────────────────────────────

function StockBadge({ stock, stockMin }) {
  const ratio = stock / stockMin;
  if (stock === 0) return <span className="badge badge-danger">Sin stock</span>;
  if (ratio <= 0.33) return <span className="badge badge-danger">Crítico</span>;
  if (ratio <= 0.75) return <span className="badge badge-warning">Bajo</span>;
  return <span className="badge badge-accent">OK</span>;
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, iconPaths, colorClass, delay }) {
  return (
    <div className={`card stat-card anim-fade-up ${delay}`}>
      <div className={`stat-icon ${colorClass}`}>
        <Icon d={iconPaths} size={20} />
      </div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}

// ── Dashboard principal ───────────────────────────────────────────────────────

export default function ProductoPage() {
  // 👇 Sustituye por tus hooks cuando los tengas
  const { Resumen, Movimientos, Alerta, loadDashboard, loading } =
    useDashboard();

  useEffect(() => {
    loadDashboard();
  }, []);

  const data = Resumen;
  const lastMovements = Movimientos;
  const lowStock = Alerta;

  const stats = [
    {
      label: "Total Productos",
      value: data?.totalProducto ?? 0,
      colorClass: "accent",
      delay: "delay-1",
      iconPaths: [
        "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
        "M3.27 6.96L12 12.01l8.73-5.05",
        "M12 22.08V12",
      ],
    },
    {
      label: "Stock Total",
      value: data?.totalStock ?? 0,
      colorClass: "info",
      delay: "delay-2",
      iconPaths: [
        "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z",
        "M7 7h.01",
      ],
    },
    {
      label: "Stock Bajo",
      value: data?.stockBajos ?? 0,
      colorClass: "danger",
      delay: "delay-3",
      iconPaths: [
        "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
        "M12 9v4",
        "M12 17h.01",
      ],
    },
    {
      label: "Categorías",
      value: data?.totalCategorias ?? 0,
      colorClass: "warning",
      delay: "delay-4",
      iconPaths: [
        "M3 3h7v7H3z",
        "M14 3h7v7h-7z",
        "M14 14h7v7h-7z",
        "M3 14h7v7H3z",
      ],
    },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-8)",
        minHeight: "100%",
      }}
    >
      {/* ── Header ────────────────────────────────────────── */}
      <div className="anim-fade-up">
        <h1>Dashboard</h1>
        <p style={{ marginTop: "var(--space-1)", fontSize: "13px" }}>
          Resumen general del inventario
        </p>
      </div>

      {/* ── Stat cards ────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "var(--space-4)",
        }}
      >
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Paneles inferiores ────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "var(--space-6)",
        }}
      >
        {/* Movimientos recientes */}
        <div className="card anim-fade-up delay-5">
          <div className="card-header">
            <h4>Movimientos Recientes</h4>
            <span className="badge badge-muted">
              {lastMovements.length} registros
            </span>
          </div>
          <div className="card-body">
            {lastMovements.length === 0 ? (
              <p style={{ fontSize: "13px" }}>
                No hay movimientos registrados.
              </p>
            ) : (
              <ul style={{ listStyle: "none" }}>
                {lastMovements.map((mov) => (
                  <li key={mov.id} className="list-item">
                    {/* Indicador tipo */}
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background:
                          mov.movementType === "In"
                            ? "var(--accent)"
                            : "var(--danger)",
                      }}
                    />
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        className="truncate"
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          marginBottom: 2,
                        }}
                      >
                        {mov.producto.name}
                      </p>
                      <p className="truncate" style={{ fontSize: "11.5px" }}>
                        {mov.producto.description}
                      </p>
                    </div>
                    {/* Badge cantidad */}
                    <span
                      className={`badge ${mov.movementType === "In" ? "badge-accent" : "badge-danger"}`}
                    >
                      {mov.movementType === "In" ? "+" : "−"}
                      {mov.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Alertas de stock */}
        <div className="card anim-fade-up delay-6">
          <div className="card-header">
            <h4>Alertas de Stock</h4>
            <span className="badge badge-danger">
              {lowStock.length} alertas
            </span>
          </div>
          <div className="card-body">
            {lowStock.length === 0 ? (
              <p style={{ fontSize: "13px" }}>
                Todo el inventario está en orden.
              </p>
            ) : (
              <ul style={{ listStyle: "none" }}>
                {lowStock.map((p) => (
                  <li key={p.id} className="list-item">
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        className="truncate"
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          marginBottom: 2,
                        }}
                      >
                        {p.name}
                      </p>
                      {/* Barra de progreso */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--space-2)",
                          marginTop: 4,
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: 4,
                            background: "var(--border)",
                            borderRadius: "var(--radius-full)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${Math.min((p.stock / p.stockMin) * 100, 100)}%`,
                              background:
                                p.stock === 0
                                  ? "var(--danger)"
                                  : p.stock / p.stockMin <= 0.33
                                    ? "var(--danger)"
                                    : "var(--warning)",
                              borderRadius: "var(--radius-full)",
                              transition: "width .3s ease",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--text-muted)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.stock} / {p.stockMin}
                        </span>
                      </div>
                    </div>
                    <StockBadge stock={p.stock} stockMin={p.stockMin} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
