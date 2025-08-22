import axios from './axios'; // tvoja axios instanca

export const getProfile = () => axios.get('/api/profile').then(r => r.data);
export const saveProfile = (payload) => axios.put('/api/profile', payload).then(r => r.data);
