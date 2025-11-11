import React, { useEffect, useRef, useState } from "react";

import { Eye, MoreVertical, CheckCircle, Clock, XCircle } from "lucide-react";

const PaymentRowActions = ({
  paymentId,
  payment,
  isAdmin,
  compact = false,
  onView,
  onUpdateStatus,
}) => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const menuRef = useRef(null);

  const status = payment?.status ?? "pending";
  const canAdmin = Boolean(isAdmin && onUpdateStatus && paymentId);

  useEffect(() => {
    const onClickAway = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, [open]);

  const runStatusChange = async (next) => {
    if (!canAdmin || status === next) return;
    try {
      setBusy(true);
      await onUpdateStatus(paymentId, next);
    } catch (err) {
      console.error("No se pudo actualizar el estado del pago:", err);
      alert("No se pudo actualizar el estado. Intenta de nuevo.");
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  // ----- UI compacta (mobile): botones directos
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onView}
          className="px-2 py-1 text-violet-700 hover:text-violet-900 disabled:opacity-50"
          disabled={!onView}
          title="Ver"
        >
          <Eye size={18} />
        </button>

        {canAdmin && (
          <>
            <button
              type="button"
              onClick={() => runStatusChange("paid")}
              className="px-2 py-1 hover:text-green-700 disabled:opacity-50"
              disabled={busy || status === "paid"}
              title="Marcar como pagado"
            >
              <CheckCircle size={18} />
            </button>
            <button
              type="button"
              onClick={() => runStatusChange("pending")}
              className="px-2 py-1 hover:text-amber-700 disabled:opacity-50"
              disabled={busy || status === "pending"}
              title="Marcar como pendiente"
            >
              <Clock size={18} />
            </button>
            <button
              type="button"
              onClick={() => runStatusChange("failed")}
              className="px-2 py-1 hover:text-red-700 disabled:opacity-50"
              disabled={busy || status === "failed"}
              title="Marcar como fallido"
            >
              <XCircle size={18} />
            </button>
          </>
        )}
      </div>
    );
  }

  // ----- UI de escritorio: botón "Más" con menú
  return (
    <div className="relative inline-flex items-center gap-2" ref={menuRef}>
      <button
        type="button"
        onClick={onView}
        className="text-violet-700 hover:text-violet-900 font-medium disabled:opacity-50"
        disabled={!onView}
      >
        Ver
      </button>

      {canAdmin && (
        <>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded hover:bg-gray-100 text-gray-600"
            aria-haspopup="menu"
            aria-expanded={open}
            disabled={busy}
          >
            <MoreVertical size={18} />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 z-20 mt-2 w-52 rounded-lg border border-gray-200 bg-white shadow-lg"
            >
              <div className="py-1 text-sm">
                <button
                  onClick={() => runStatusChange("paid")}
                  className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
                  disabled={busy || status === "paid"}
                >
                  <CheckCircle size={16} />
                  Marcar como pagado
                </button>
                <button
                  onClick={() => runStatusChange("pending")}
                  className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
                  disabled={busy || status === "pending"}
                >
                  <Clock size={16} />
                  Marcar como pendiente
                </button>
                <button
                  onClick={() => runStatusChange("failed")}
                  className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
                  disabled={busy || status === "failed"}
                >
                  <XCircle size={16} />
                  Marcar como fallido
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};


export default PaymentRowActions;
