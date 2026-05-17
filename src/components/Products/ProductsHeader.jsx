export default function ProductsHeader({
  search,
  onSearchChange,
  onCreateClick,
  onRefresh,
  loading,
}) {
  return (
    <section className="products-hero anim-fade-up">
      <div>
        <span className="products-kicker">Inventario</span>
        <h1>Productos</h1>
        <p className="products-subtitle">
          Gestiona altas, ediciones y bajas desde una sola vista.
        </p>
      </div>

      <div className="products-toolbar">
        <div className="products-search">
          <input
            className="input"
            type="search"
            placeholder="Buscar por nombre, SKU o categoría"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <button className="btn btn-ghost" onClick={onRefresh} disabled={loading}>
          {loading ? "Actualizando..." : "Recargar"}
        </button>

        <button className="btn btn-primary" onClick={onCreateClick}>
          Nuevo producto
        </button>
      </div>
    </section>
  );
}
