import { Minus, Plus } from "lucide-react";
import ProductStatusBadge from "./ProductStatusBadge";

function formatPrice(price) {
  if (!price) return "N/A";

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(price);
}

function EmptyStateRow({ children }) {
  return (
    <tr>
      <td colSpan="7">
        <div className="products-empty-state">{children}</div>
      </td>
    </tr>
  );
}

function ProductRow({
  product,
  deletingId,
  onEdit,
  onDelete,
  openAdjust,
  isAdjusting,
}) {
  const isDeleting = deletingId === product.id;

  return (
    <tr>
      <td>
        <div className="products-cell-stack">
          <strong>{product.name || "Sin nombre"}</strong>
          <span>{product.description || "Sin descripción"}</span>
        </div>
      </td>
      <td>{product.sku || "N/A"}</td>
      <td>{product.categoryName || "Sin categoría"}</td>
      <td>{formatPrice(product.price)}</td>
      <td>
        <div className="products-cell-stack">
          <strong>{product.stock}</strong>
          <span>Mínimo: {product.stockMin}</span>
        </div>
      </td>
      <td>
        <ProductStatusBadge stock={product.stock} stockMin={product.stockMin} />
      </td>
      <td>
        <div className="products-actions">
          <button
            className="btn btn-ghost products-action-btn"
            onClick={() => onEdit(product)}
          >
            Editar
          </button>
          <button
            className="btn btn-danger products-action-btn"
            onClick={() => onDelete(product)}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </button>
          <div className="stock-actions">
            <button
              type="button"
              className="stock-action-button stock-action-button--add"
              onClick={() => openAdjust(product, "entrada")}
              disabled={isAdjusting}
              aria-label={`Agregar stock a ${product.name}`}
            >
              <Plus size={16} />
            </button>

            <button
              type="button"
              className="stock-action-button stock-action-button--remove"
              onClick={() => openAdjust(product, "salida")}
              disabled={product.stock === 0 || isAdjusting}
              aria-label={`Retirar stock de ${product.name}`}
            >
              <Minus size={16} />
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

function ProductsTableBody({
  products,
  loading,
  deletingId,
  onEdit,
  onDelete,
  openAdjust,
  isAdjusting,
}) {
  if (loading) {
    return (
      <tbody>
        <EmptyStateRow>
          <div className="spinner" />
          <span>Cargando productos...</span>
        </EmptyStateRow>
      </tbody>
    );
  }

  if (products.length === 0) {
    return (
      <tbody>
        <EmptyStateRow>
          <span>No hay productos para mostrar.</span>
        </EmptyStateRow>
      </tbody>
    );
  }

  return (
    <tbody>
      {products.map((product) => (
        <ProductRow
          key={product.id}
          product={product}
          deletingId={deletingId}
          onEdit={onEdit}
          onDelete={onDelete}
          isAdjusting={isAdjusting}
          openAdjust={openAdjust}
        />
      ))}
    </tbody>
  );
}

export default function ProductsTable({
  products,
  loading,
  deletingId,
  onEdit,
  onDelete,
  openAdjust,
  isAdjusting,
}) {
  return (
    <section className="card anim-fade-up delay-5">
      <div className="card-header">
        <div>
          <h4>Listado de productos</h4>
          <p className="products-card-caption">
            Vista centralizada para consultar y operar el inventario.
          </p>
        </div>
        <span className="badge badge-muted">{products.length} registros</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>SKU</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <ProductsTableBody
            products={products}
            loading={loading}
            deletingId={deletingId}
            onEdit={onEdit}
            onDelete={onDelete}
            openAdjust={openAdjust}
            isAdjusting={isAdjusting}
          />
        </table>
      </div>
    </section>
  );
}
