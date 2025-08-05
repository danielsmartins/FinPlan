import api from './api';

// A função agora faz apenas uma chamada para o novo endpoint otimizado
export const getDashboardData = async () => {
  try {
    const response = await api.get('/dashboard'); // Faz a chamada GET para a nova rota
    return response.data; // Retorna o objeto completo com todos os dados
  } catch (error) {
    console.error("Erro no serviço de dashboard:", error);
    // Re-lança o erro para que o componente do dashboard possa tratá-lo
    throw error;
  }
};
