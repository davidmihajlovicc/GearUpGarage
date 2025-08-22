import axios from './axios'; // koristi tvoju axios instancu

// --- Users ---
export const adminSearchUsers = (q) =>
  axios.get('/api/admin/users', { params: { q } }).then(r => r.data);

export const adminGetUser = (id) =>
  axios.get(`/api/admin/users/${id}`).then(r => r.data);

export const adminSetRole = (id, isAdmin) =>
  axios.patch(`/api/admin/users/${id}/role`, { isAdmin }).then(r => r.data);
