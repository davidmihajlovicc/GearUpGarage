import axios from './axios';


const toArray = (d) => {
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.rows)) return d.rows;
  if (Array.isArray(d?.data)) return d.data;
  return [];
};

// dropdowns (safe)
export const getBrands     = async () => toArray((await axios.get('/api/brands')).data);
export const getModels     = async (brand_id) => toArray((await axios.get('/api/models', { params: { brand_id } })).data);
export const getPartTypes  = async () => toArray((await axios.get('/api/part-types')).data);
export const getYears      = async () => toArray((await axios.get('/api/years')).data);

// parts (safe)
export const searchParts = async (params = {}) => {
  try {
    const r = await axios.get('/api/parts', { params });
    return toArray(r.data);
  } catch {
    return [];
  }
};

export const createPart = (formData) =>
  axios.post('/api/parts', formData).then(r => r.data);


export async function deletePart(id) {
  const token = localStorage.getItem('token');
  // koristi relativni URL – axios instanca brine o baseURL-u
  return axios.delete(`/api/parts/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export const updatePart = (id, formData) =>
  axios.put(`/api/parts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data);
// auth
export const login = (email, password) =>
  axios.post('/api/login', { email, password }).then(r => r.data);

export const registerUser = (payload) =>
  axios.post('/api/register', payload).then(r => r.data);

// order
export const createOrder = (part_id) =>
  axios.post('/api/orders', { part_id }).then(r => r.data);

export const getPartSubtypes = (part_type_id) =>
  axios.get('/api/part-subtypes', { params: { part_type_id } }).then(r => r.data);

export const getPart = (id) =>
  axios.get(`/api/parts/${id}`).then(r => r.data);