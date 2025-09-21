
import axios from './axios';


const normalizeOrder = (o) => ({
  id: o.id ?? o.order_id ?? String(o?.id || ''),
  createdAt: o.createdAt ?? o.created_at ?? o.created_at_iso ?? o.created_at_ts ?? o.created_at ?? '',
  total: Number(o.total ?? o.amount ?? 0),
  rawStatus: o.status ?? o.order_status ?? null,
  items: Array.isArray(o.items) ? o.items : [],
});

export const getMyOrders = async (limit = 5) => {
  const res = await axios.get('/api/orders', { params: { limit } });
  const data = res?.data?.rows || res?.data?.data || res?.data || [];
  return (Array.isArray(data) ? data : []).map(normalizeOrder);
};

export const cancelOrder = async (orderId) => {
  const res = await axios.post(`/api/orders/${orderId}/cancel`);
  return res?.data ?? { ok: true };
};
