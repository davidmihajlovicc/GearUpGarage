// src/components/OrdersList.jsx
import React, { useMemo } from 'react';

const CUTOFF_MS = 24 * 60 * 60 * 1000;

const isWithin24h = (iso) => {
  const t = new Date(iso).getTime();
  return Date.now() - t < CUTOFF_MS;
};

const formatDateTime = (iso) => {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return iso;
  }
};

const formatMoney = (n) => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format(n ?? 0);
  } catch {
    return Number(n ?? 0).toFixed(2);
  }
};

export default function OrdersList({ orders = [], onCancel }) {
  const lastFive = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [orders]
  );

  if (!lastFive.length) {
    return <div className="card orders-empty">Nema narudžbi.</div>;
  }

  return (
    <div className="orders-list">
      {lastFive.map((o) => {
        const canCancel = isWithin24h(o.createdAt);
        const displayStatus = canCancel ? 'preparation' : 'shipped';

        return (
          <div key={o.id} className="card order-card">
            <div className="order-head">
              <div className="order-meta">
                <div className="order-row">
                  <span className="order-id">#{o.id}</span>
                  <span className="pill">{displayStatus}</span>
                </div>

                <div className="order-placed">Placed {formatDateTime(o.createdAt)}</div>
                <div className="order-total">Total: {formatMoney(o.total)}</div>

                {o.items?.length > 0 && (
                  <ul className="order-items">
                    {o.items.map((it, idx) => (
                      <li key={idx}>
                        {it.name ?? it.title ?? 'Item'} × {it.qty ?? it.quantity ?? 1}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="order-actions">
                {canCancel ? (
                  <button className="btn btn--danger" onClick={() => onCancel?.(o.id)}>
                    Cancel order
                  </button>
                ) : (
                  <div className="order-cancel-note">
                    Cancellation unavailable (already shipped)
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
