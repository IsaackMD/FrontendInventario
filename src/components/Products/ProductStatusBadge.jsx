export default function ProductStatusBadge({ stock, stockMin }) {
  if (stock <= 0) {
    return <span className="badge badge-danger">Sin stock</span>;
  }

  if (stockMin > 0 && stock <= stockMin) {
    return <span className="badge badge-warning">Stock bajo</span>;
  }

  return <span className="badge badge-accent">Disponible</span>;
}
