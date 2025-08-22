import axios from './axios'; // ili od tebe gdje već izvezeš axios instance

export const apiLogin = (email, password) =>
  axios.post('/api/login', { email, password }).then(r => r.data);

export const apiRegister = (email, password) =>
  axios.post('/api/register', { email, password }).then(r => r.data);
