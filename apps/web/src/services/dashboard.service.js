import api from './api';

export const getDashboardData = async () => {
  try {
    const response = await api.get('/dashboard'); 
    return response.data; 
  } catch (error) {
    console.error("Erro no serviço de dashboard:", error);

    throw error;
  }
};
