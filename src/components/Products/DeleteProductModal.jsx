export default function DeleteProductModal({
  open,
  product,
  deleting,
  onClose,
  onConfirm,
}) {
  if (!open || !product) return null;

  return (
    <div className="products-modal-overlay" role="presentation">
      <div className="products-modal products-modal-sm card anim-fade-in" role="dialog" aria-modal="true">
        <div className="card-header">
          <div>
            <h4>Eliminar producto</h4>
            <p className="products-card-caption">
              Esta acción eliminará el registro seleccionado.
            </p>
          </div>
        </div>

        <div className="card-body products-delete-copy">
          <p>
            ¿Deseas eliminar <strong>{product.name || "este producto"}</strong>?
          </p>
          <p>Si tu API lo permite, la acción se ejecutará de forma inmediata.</p>
        </div>

        <div className="products-modal-actions">
          <button className="btn btn-ghost" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? "Eliminando..." : "Confirmar eliminación"}
          </button>
        </div>
      </div>
    </div>
  );
}
