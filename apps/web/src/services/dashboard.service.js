import api from './api';

/**
 * Busca todos os dados necessários para o dashboard de uma só vez.
 * Inclui transações, categorias, investimentos, orçamentos e cartões de crédito.
 * @returns {Promise<Object>} Uma promessa que resolve para um objeto contendo todos os dados do dashboard.
 */
export const getDashboardData = async () => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Faz todas as chamadas de API necessárias em paralelo
    const [
      transactionsResponse,
      categoriesResponse,
      investmentsResponse,
      budgetsResponse,
      creditCardsResponse // Adicionado
    ] = await Promise.all([
      api.get('/transactions'),
      api.get('/categories'),
      api.get('/investments'),
      api.get('/budgets', { params: { month, year } }),
      api.get('/credit-cards') // Adicionado
    ]);

    // Retorna um único objeto com todos os dados resolvidos.
    return {
      transactions: transactionsResponse.data,
      categories: categoriesResponse.data,
      investments: investmentsResponse.data,
      budgets: budgetsResponse.data,
      creditCards: creditCardsResponse.data, // Adicionado
    };
    
  } catch (error) {
    console.error("Erro ao buscar dados completos do dashboard:", error.response?.data || error.message);
    throw error;
  }
};
