import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../iu/Dialog";
import "./styles/StockAdjustDialog.css";

export function StockAdjustDialog({
  product,
  type,
  open,
  onOpenChange,
  onAdjust,
  isLoading,
}) {
  const [quantity, setQuantity] = useState("");

  const isEntry = type === "entrada";
  const currentStock = product?.stock ?? 0;
  const qty = Number(quantity);
  const maxQuantity = isEntry ? undefined : currentStock;

  useEffect(() => {
    if (!open) setQuantity("");
  }, [open]);

  const handleSubmit = async () => {
    if (!product || !quantity || qty <= 0) return;

    if (!isEntry && qty > currentStock) {
      toast.error(`No puedes retirar más de ${currentStock} unidades`);
      return;
    }

    await onAdjust({productId: product.id, quantity: qty});
    setQuantity("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="stock-dialog">
        <DialogHeader>
          <DialogTitle
            className={`stock-dialog__title ${
              isEntry ? "stock-dialog__title--entry" : "stock-dialog__title--exit"
            }`}
          >
            {isEntry ? <Plus size={22} /> : <Minus size={22} />}
            {isEntry ? "Agregar stock" : "Retirar stock"}
          </DialogTitle>

          <DialogDescription className="stock-dialog__description">
            {product?.name ?? "Producto no seleccionado"}
          </DialogDescription>
        </DialogHeader>

        <div className="stock-dialog__body">
          <div className="stock-dialog__current">
            <span>Stock actual</span>
            <strong>{currentStock} unidades</strong>
          </div>

          <div className="stock-dialog__field">
            <label htmlFor="quantity">
              Cantidad a {isEntry ? "agregar" : "retirar"}
            </label>

            <input
              id="quantity"
              type="number"
              min="1"
              max={maxQuantity}
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              autoFocus
              className={isEntry ? "input-entry" : "input-exit"}
            />

            {!isEntry && (
              <p>Máximo disponible: {maxQuantity} unidades</p>
            )}
          </div>

          {quantity && qty > 0 && (
            <div className="stock-dialog__preview">
              <span>Nuevo stock</span>
              <strong className={isEntry ? "text-entry" : "text-exit"}>
                {isEntry ? currentStock + qty : currentStock - qty} unidades
              </strong>
            </div>
          )}
        </div>

        <DialogFooter className="stock-dialog__footer">
          <button
            type="button"
            className="stock-dialog__button stock-dialog__button--secondary"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!quantity || qty <= 0 || isLoading}
            className={`stock-dialog__button ${
              isEntry
                ? "stock-dialog__button--entry"
                : "stock-dialog__button--exit"
            }`}
          >
            {isLoading ? (
              "Procesando..."
            ) : (
              <>
                {isEntry ? <Plus size={16} /> : <Minus size={16} />}
                {isEntry ? "Agregar" : "Retirar"}
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}