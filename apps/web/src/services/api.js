import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});


api.interceptors.request.use(async (config) => {
 
  const token = localStorage.getItem('authToken');

  if (token) {
    // Adiciona o token ao cabeçalho 'Authorization'
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
