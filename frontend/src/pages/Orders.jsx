// src/pages/Orders.jsx
import React, { useEffect, useState, useCallback } from 'react';
import OrdersList from '../components/OrdersList';
import { getMyOrders, cancelOrder } from '../api/orders';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setErr(null);
      const data = await getMyOrders(5);
      setOrders(data);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || 'Error.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancel = async (orderId) => {
    try {
      setBusyId(orderId);
      await cancelOrder(orderId);
      
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Error.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight orders-title">My Recent Orders</h1>

        {loading && (
          <div className="mt-6 rounded-2xl border bg-white p-6">Loading…</div>
        )}
        {err && !loading && (
          <div className="mt-6 rounded-2xl border bg-red-50 text-red-700 p-4 text-sm">
            {String(err)}
          </div>
        )}
        {!loading && !err && (
          <OrdersList
            orders={orders}
            onCancel={(id) => (busyId ? null : handleCancel(id))}
          />
        )}
      </div>
    </div>
  );
}
