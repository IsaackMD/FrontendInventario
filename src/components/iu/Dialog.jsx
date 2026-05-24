import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { createPortal } from "react-dom";
import { X } from "lucide-react";

import "./styles/Dialog.css";

const DialogContext = createContext(null);

export function Dialog({ children, open, onOpenChange }) {
  return (
    <DialogContext.Provider
      value={{
        open,
        setOpen: onOpenChange,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

function useDialog() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("Dialog components must be used inside Dialog");
  }

  return context;
}

export function DialogTrigger({ children }) {
  const { setOpen } = useDialog();

  return (
    <button type="button" onClick={() => setOpen(true)}>
      {children}
    </button>
  );
}

export function DialogClose({ children, className = "" }) {
  const { setOpen } = useDialog();

  return (
    <button
      type="button"
      className={className}
      onClick={() => setOpen(false)}
    >
      {children}
    </button>
  );
}

export function DialogContent({
  children,
  className = "",
  closeOnOverlay = true,
}) {
  const { open, setOpen } = useDialog();

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return createPortal(
    <div className="dialog">
      <div
        className="dialog__overlay"
        onClick={() => closeOnOverlay && setOpen(false)}
      />

      <div
        className={`dialog__content ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="dialog__close"
          onClick={() => setOpen(false)}
        >
          <X size={18} />
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
}

export function DialogHeader({ children, className = "" }) {
  return (
    <div className={`dialog__header ${className}`}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = "" }) {
  return (
    <h2 className={`dialog__title ${className}`}>
      {children}
    </h2>
  );
}

export function DialogDescription({ children, className = "" }) {
  return (
    <p className={`dialog__description ${className}`}>
      {children}
    </p>
  );
}

export function DialogFooter({ children, className = "" }) {
  return (
    <div className={`dialog__footer ${className}`}>
      {children}
    </div>
  );
}