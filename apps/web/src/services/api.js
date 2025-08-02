import axios from 'axios';

// Cria uma instância do axios com a URL base da nossa API
const api = axios.create({
  baseURL: 'http://localhost:3333', 
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(async (config) => {
  // Pegamos o token do localStorage 
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