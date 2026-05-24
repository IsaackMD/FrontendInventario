import { useEffect, useState } from "react";

const INITIAL_FORM = {
  name: "",
  description: "",
  sku: "",
  categoryId: "",
  categoryName: "",
  stock: 0,
  stockMin: 0,
  price: 0,
};

function getInitialState(product) {
  if (!product) return INITIAL_FORM;

  return {
    name: product.name ?? "",
    description: product.description ?? "",
    sku: product.sku ?? "",
    categoryId: product.categoryId ?? "",
    categoryName: product.categoryName ?? "",
    stock: product.stock ?? 0,
    stockMin: product.stockMin ?? 0,
    price: product.price ?? 0,
  };
}

export default function ProductFormModal({
  loadCategorias,
  product,
  saving,
  onClose,
  onSubmit,
  categorias = [],
}) {
  const [form, setForm] = useState(() => getInitialState(product));

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  useEffect(() => {
    loadCategorias();
  }, [loadCategorias]);

  return (
    <div className="products-modal-overlay" role="presentation">
      <div
        className="products-modal card anim-fade-in"
        role="dialog"
        aria-modal="true"
      >
        <div className="card-header">
          <div>
            <h4>{product ? "Editar producto" : "Nuevo producto"}</h4>
            <p className="products-card-caption">
              Completa la información principal del producto.
            </p>
          </div>
          <button
            className="btn btn-ghost products-close-btn"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>

        <form className="products-form" onSubmit={handleSubmit}>
          <div className="products-form-grid">
            <div className="products-form-span">
              <label htmlFor="product-name">Nombre</label>
              <input
                id="product-name"
                className="input"
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                required
              />
            </div>

            <div className="products-form-span">
              <label htmlFor="product-description">Descripción</label>
              <textarea
                id="product-description"
                className="input products-textarea"
                value={form.description}
                onChange={(event) =>
                  handleChange("description", event.target.value)
                }
                rows="4"
              />
            </div>
            <div className="products-form-span">
              <label htmlFor="product-category-id">Categorías</label>
              <select
                id="product-category-id"
                className="input"
                value={form.categoryId}
                onChange={(event) =>
                  handleChange("categoryId", event.target.value)
                }
              >
                <option value="">Seleccione Categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.name}
                  </option>
                ))}
              </select>
            </div>

            {!product && (
              <div>
                <label htmlFor="product-stock">Stock</label>
                <input
                  id="product-stock"
                  className="input"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(event) =>
                    handleChange("stock", event.target.value)
                  }
                />
              </div>
            )}

            <div>
              <label htmlFor="product-stock-min">Stock mínimo</label>
              <input
                id="product-stock-min"
                className="input"
                type="number"
                min="0"
                value={form.stockMin}
                onChange={(event) =>
                  handleChange("stockMin", event.target.value)
                }
              />
            </div>
          </div>

          <div className="products-modal-actions">
            <button className="btn btn-ghost" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving
                ? "Guardando..."
                : product
                  ? "Guardar cambios"
                  : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
