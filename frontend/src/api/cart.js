// src/api/cart.js
import axios from './axios';

export const getCart = () => axios.get('/api/cart').then(r => r.data);
export const addToCart = (part_id, qty=1) => axios.post('/api/cart', { part_id, qty }).then(r => r.data);
export const setCartQty = (part_id, qty) => axios.patch('/api/cart', { part_id, qty }).then(r => r.data);
export const removeFromCart = (part_id) => axios.delete(`/api/cart/${part_id}`).then(r => r.data);
export const checkout = () => axios.post('/api/cart/checkout').then(r => r.data);
