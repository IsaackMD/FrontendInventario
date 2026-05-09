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

export default StatCard;
