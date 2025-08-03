import api from './api';


export const getDashboardData = async () => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Faz todas as chamadas de API necessárias em paralelo para otimizar o tempo de carregamento.
    const [
      transactionsResponse,
      categoriesResponse,
      investmentsResponse,
      budgetsResponse
    ] = await Promise.all([
      api.get('/transactions'),
      api.get('/categories'),
      api.get('/investments'),
      api.get('/budgets', { params: { month, year } })
    ]);

    // Retorna um único objeto com todos os dados resolvidos.
    return {
      transactions: transactionsResponse.data,
      categories: categoriesResponse.data,
      investments: investmentsResponse.data,
      budgets: budgetsResponse.data,
    };
    
  } catch (error) {
    console.error("Erro ao buscar dados completos do dashboard:", error.response?.data || error.message);
    throw error;
  }
};
