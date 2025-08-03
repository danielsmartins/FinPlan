import api from './api';

export const getDashboardData = async () => {
  try {
    // Usa Promise.all para fazer as chamadas em paralelo, otimizando o carregamento.
    const [transactionsResponse, categoriesResponse] = await Promise.all([
      api.get('/transactions'),
      api.get('/categories')
    ]);

    // Retorna um objeto com os dados de ambas as respostas.
    return {
      transactions: transactionsResponse.data,
      categories: categoriesResponse.data,
    };
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error.response?.data || error.message);
    // Lança o erro para que o componente possa tratá-lo.
    throw error;
  }
};
